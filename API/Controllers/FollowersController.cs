using System.Threading.Tasks;
using Application.Followers;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Application.Profiles;

namespace API.Controllers
{
    [Route("api/profiles")]
    public class FollowersController : BaseController
    {
        [HttpPost("{username}/follow")]
    public async Task<ActionResult<Unit>> Follow(string username)
    {
        return await Mediator.Send(new Add.Command { username = username });
    }

    [HttpDelete("{username}/follow")]
    public async Task<ActionResult<Unit>> UnFollow(string username)
    {
        return await Mediator.Send(new Delete.Command { username = username });
    }

    [HttpGet("{username}/follow")]
    public async Task<ActionResult<List<Profile>>> GetFollowings(string username, string predicate)
        {
            return await Mediator.Send(new List.Query{Username = username,
            Predicate = predicate});
        }
    }

    
}