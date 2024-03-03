using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ErrorController : BaseApiController
{
    private readonly DataContext _context;

    public ErrorController(DataContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpGet("auth")]
    public ActionResult<string> GetSecret()
    {
        return "secret text";
    }

    [HttpGet("not-found")]
    public ActionResult<AppUser> GetNotFound()
    {
        var result = _context.Users.Find(-1);

        if (result == null) return NotFound();

        return result;
    }

    [HttpGet("server-error")]
    public ActionResult<string> GetServerError()
    {
        var result = _context.Users.Find(-1);

        var resultToReturn = result.ToString();

        return resultToReturn;
    }

    [HttpGet("bad-request")]
    public ActionResult<string> GetBadRequest()
    {
        return BadRequest("Bad Request");
    }

}
