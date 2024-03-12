using System.Security.Claims;

namespace API;

public static class ClaimsPrincipalExtentions
{
    public static string GetUsername(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}
