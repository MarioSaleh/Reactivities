using System.Threading.Tasks;
using System.Threading;
using Persistence;
using System;
using MediatR;
using AutoMapper;
using Application.Errors;
using System.Net;
using Microsoft.EntityFrameworkCore;
using Domain;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDto>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
            public string Username { get; set; }

        }

        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }


            public async Task<CommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);
                
                if(activity == null)
                throw new RestException(HttpStatusCode.NotFound, new {activity= "Activity Not found"});

                var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == request.Username);

                var comment = new Comment
                {
                    Author = user,
                    Activity = activity,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };

                activity.Comments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;
                
                if (success) return _mapper.Map<CommentDto>(comment); // returning to our api controller

                throw new Exception("Problem saving changes");
            }

        }
    }
}