﻿namespace API.Helpers;
// ?pageNumber=1&pageSize=5
public class UserParams : PaginationParams
{
    public string CurrentUsername { get; set; }
    public string Gender { get; set; }
    public int MinAge { get; set; } = 18;
    public int MaxAge { get; set; } = 99;
    public string OrderBy { get; set; }
    public bool Likees { get; set; } = false;
    public bool Likers { get; set; } = false;
}
