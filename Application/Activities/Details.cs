using MediatR;
using Domain;
using System;
using System.Threading;
using System.Threading.Tasks;
using Persistence;
using Application.Errors;
using System.Net;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Activity>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
               var activity = await _context.Activities.FindAsync(request.Id);
               
                if(activity == null)
                    throw new RestException(HttpStatusCode.NotFound,new {activity = "Not Found"});

                return activity;
            }
        }
    }
}