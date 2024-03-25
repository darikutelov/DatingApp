using System.Security.Cryptography.X509Certificates;
using API.Helpers;

namespace API.Helpers;

public class LikesParams : PaginationParams
{
    public int UserId { get; set; }
    public string Predicate { get; set; }
}
