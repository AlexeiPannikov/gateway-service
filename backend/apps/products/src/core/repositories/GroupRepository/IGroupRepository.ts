import {Group} from "../../entities/Group/Group";
import {CreateGroupDto} from "./dto/CreateGroup.dto";
import {UpdateGroupDto} from "./dto/UpdateGroup.dto";

export interface IGroupRepository {
    getGroups(): Promise<Group[]>
    create(dto: CreateGroupDto): Promise<Group>;
    update(dto: UpdateGroupDto): Promise<Group>;
    delete(id: number): Promise<boolean>;
}

export const IGroupRepository = Symbol("IGroupRepository")