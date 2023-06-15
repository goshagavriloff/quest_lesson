import { teacherRepository } from "../repo/TeacherRepository"


class TeacherService {
    public async checkIfExists(id:number):Promise<boolean> {
        return await teacherRepository.recordExistsById(id);
    }


}
export const teacherService=new TeacherService()