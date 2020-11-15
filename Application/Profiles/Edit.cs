using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command : IRequest
        {
            public string displayName{get;set;}
            public string bio{get;set;}
        }

         public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.bio).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context,IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetCurrentUserName());

                if(user == null)
                    throw new RestException(HttpStatusCode.BadRequest,new {user = "User could not be found"});

                user.Bio = request.bio ?? user.Bio;
                user.DisplayName= request.displayName ?? user.DisplayName;

                var success = await _context.SaveChangesAsync() > 0;
                if(success) return Unit.Value; // returning to our api controller

                throw new Exception("Problem saving changes");
            }

        }
    }
}