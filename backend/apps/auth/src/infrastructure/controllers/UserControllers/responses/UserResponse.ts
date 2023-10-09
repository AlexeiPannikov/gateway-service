import {User} from "../../../../core/entities/User/User";

export class UserResponse extends User{

    constructor(user: User) {
        super()
        this.id = user.id
        this.name = user.name
        this.email = user.email
        this.isActivated = user.isActivated
        this.role = user.role
    }
}