namespace API.Interfaces;

public interface IUnitOfWork
{
    IUserRepository UserRepository { get; }
    ILikesRepository LikesRepository { get; }
    IMessageRepository MessageRepository { get; }
    //IPhotoService PhotoService { get; }
    Task<bool> Complete();
    bool HasChanges();
}
