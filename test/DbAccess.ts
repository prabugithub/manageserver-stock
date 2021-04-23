import { UserCredentialsDBAccess } from "../src/Authorization/UserCredentialsDBAccess";
import { WorkingPosition } from "../src/Shared/Model";
import { UserDBAccess } from "../src/User/UserDBAccess";


class DbAccess {

    public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
    public userAccess: UserDBAccess = new UserDBAccess();
}

// new DbAccess().dbAccess.putUserCredential(
//     {
//         accessRights: [0, 1,2,3],
//         password: 'test',
//         username: 'prabhu'
//     }
// )

new DbAccess().userAccess.putUser({
    id: 'we23qwda',
    name: 'prabhu',
    age: 32,
    email: 'ab@test.co',
    workingPosition: WorkingPosition.EXPERT
}) 