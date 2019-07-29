import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { UserService } from '@app/services/user.service';
import { AppService } from './shared/app.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { User } from '@app/model/user';
// import { asyncData } from 'src/testing/async-observable-helper';
// import { async } from '@angular/core/testing';
describe('userService test Site : ', () => {
    let userService: UserService;
    let appService: AppService;
    let httpClientSpy: { get: jasmine.Spy };
    const usersListExpectedOp: User[] = [{
        'userId': 16,
        'userName': 'Akniht',
        'emailId': 'a@si.om',
        'role': 'Operator',
        'scope': 'Write',
        'PhoneNumber': '1234455',
        'isEditEnabled': false,
        'isEditSelfEmailIdEnabled': false,
        'isEditPhoneNoEnabled': false
    },
    {
        'userId': 18,
        'userName': 'amritha',
        'emailId': 'a@sie.com',
        'role': 'Operator',
        'scope': 'Write',
        'PhoneNumber': '11122',
        'isEditEnabled': false,
        'isEditSelfEmailIdEnabled': false,
        'isEditPhoneNoEnabled': false
    }];
    beforeEach((() => {
        appService = new AppService();
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        userService = new UserService(<any>httpClientSpy, appService);
    }));
    // afterEach(() => {
    //     httpClientSpy = null;
    // });
    it('user service should be created', () => {
        expect(userService).toBeTruthy();
    });
    // it('user service should successfully return the list of users with length greater than 0', () => {
    //     // set return value to the http get method
    //     // httpClientSpy.get.and.returnValue(asyncData(usersListExpectedOp));
    //     httpClientSpy.get.and.returnValue(of(usersListExpectedOp));
    //     userService.getUsersdetail().subscribe((users: any) => {
    //         expect(users.length).toBeGreaterThan(0);
    //         expect(users).toBeDefined();
    //         expect(users).toEqual(usersListExpectedOp);
    //     });

    // });
    it('Method Should not be able to return a data which is a non user Model type', () => {
        const actualRes = [{
            'Id': 16,
            'RollName': 'Akniht',
            'emailId': 'a@si.om',
        }];
        // set return value to the http get method
        // httpClientSpy.get.and.returnValue(asyncData(actualRes));
        httpClientSpy.get.and.returnValue(of(actualRes));
        // userService.getUsersdetail().subscribe((users: any) => {
        //     //  expect(users.length).toBeGreaterThan(0);
        //     expect(users).not.toBe(usersListExpectedOp);
        // });
    });
    it('Null data and undefined data should not be expected from the getuserslist', () => {
        // set return value to the http get method
        // httpClientSpy.get.and.returnValue(asyncData(usersListExpectedOp));
        httpClientSpy.get.and.returnValue(of(usersListExpectedOp));
        // userService.getUsersdetail().subscribe((users: any) => {
        //     expect(users).not.toBeNull();
        // });
    });
    it('User Should not be able to return a data which is a non user Model type', () => {
        const actualRes = [{
            'Id': 16,
            'RollName': 'Akniht',
            'emailId': 'a@si.om',
        }];
        // set return value to the http get method
        // httpClientSpy.get.and.returnValue(asyncData(actualRes));
        httpClientSpy.get.and.returnValue(of(actualRes));
        // userService.getUsersdetail().subscribe((users: any) => {
        //     expect(users).not.toBe(usersListExpectedOp);
        // });
    });
    // it('get User By Username to check if the user already exists in the database', () => {
    //     const mockdata = {
    //         'userId': 18,
    //         'userName': 'amritha',
    //     };
    //     const inputData = 'amritha';
    //    // httpClientSpy.get.and.returnValue(asyncData(mockdata));
    //     httpClientSpy.get.and.returnValue(of(mockdata));
    //     userService.getUserByUsername(inputData).subscribe((res) => {
    //         expect(res).toBeDefined();
    //         expect(res).toEqual(mockdata, 'result matched');
    //     });
    // });
    it('1check if password is defined for the registered-user while logging in', () => {
        const inputData = { username: '1111', password: '123r4r4r4r' };
        const mockdata = false;
      // httpClientSpy.get.and.returnValue(asyncData(mockdata));
       httpClientSpy.get.and.returnValue(of(mockdata));
        userService.checkIfPasswordIsInValid(inputData).subscribe((res) => {
            expect(res).toBeFalsy();
        });
    });
    it('2check if password is valid for the logged in user while log in', () => {
        const inputData = { username: 'admin', password: '123' };
        const mockdata = true;
       // httpClientSpy.get.and.returnValue(asyncData(mockdata));
        httpClientSpy.get.and.returnValue(of(mockdata));
        userService.checkIfPasswordIsInValid(inputData).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).toEqual(true);
        });
    });
    /*   let appService: AppService;
       let httpMock: HttpTestingController;
       let userService: UserService;
       let httpClientSpy: { get: jasmine.Spy };
       beforeEach(() => {
           TestBed.configureTestingModule({
               imports: [HttpClientTestingModule],
               // Provide both the service-to-test and its (spy) dependency
               providers: [
                   UserService,
                   { provide: HttpClient, useClass: HttpClient },
                   { provide: AppService, useClass: AppService },
               ]
           });
           // Inject both the service-to-test and its (spy) dependency
           httpMock = TestBed.get(HttpTestingController);
           appService = TestBed.get(AppService);
           userService = TestBed.get(UserService);
           httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
       });
       afterEach(() => {
           httpClientSpy = null;
       });
       fit('user service should successfully return the list of users with length greater than 0', () => {
           const mockUsersList: User[] = [{
               'userId': 16,
               'userName': 'Akniht',
               'emailId': 'a@si.om',
               'role': 'Operator',
               'scope': 'Write',
               'PhoneNumber': '1234455',
               'isEditEnabled': false,
               'isEditSelfEmailIdEnabled': false,
               'isEditPhoneNoEnabled': false
           },
           {
               'userId': 18,
               'userName': 'amritha',
               'emailId': 'a@sie.com',
               'role': 'Operator',
               'scope': 'Write',
               'PhoneNumber': '11122',
               'isEditEnabled': false,
               'isEditSelfEmailIdEnabled': false,
               'isEditPhoneNoEnabled': false
           }];
           // set return value to the http get method
           httpClientSpy.get.and.returnValue(asyncData(mockUsersList));
           userService.getUsersdetail().subscribe((users: any) => {
               expect(users.length).toBeGreaterThan(0);
               expect(users).toEqual(mockUsersList, 'users list');
           });
       });
       fit('user service should fail if the data in not in format of users model', () => {
           const mockUsersList: User[] = [{
               'userId': 16,
               'userName': 'Akniht',
               'emailId': 'a@si.om',
               'role': 'Operator',
               'scope': 'Write',
               'PhoneNumber': '1234455',
               'isEditEnabled': false,
               'isEditSelfEmailIdEnabled': false,
               'isEditPhoneNoEnabled': false
           },
           {
               'userId': 18,
               'userName': 'amritha',
               'emailId': 'a@sie.com',
               'role': 'Operator',
               'scope': 'Write',
               'PhoneNumber': '11122',
               'isEditEnabled': false,
               'isEditSelfEmailIdEnabled': false,
               'isEditPhoneNoEnabled': false
           }];
           const actualData = [{
               'Id': 18,
               'RollNo': 'amritha',
               'emailId': 'a@sie.com',
               'role': 'Operator'
           }];
           // set return value to the http get method
           httpClientSpy.get.and.returnValue(asyncData(actualData));
           userService.getUsersdetail().subscribe((users: any) => {
               // expect(users.length).toBeGreaterThan(0);
               expect(users).toEqual(mockUsersList, 'users list');
           });
       });
       fit('update user details in the database', () => {
           const mockdata = [
               {
                   'userId': 16,
                   'userName': 'Akniht',
                   'emailId': 'a@siemens.om',
                   'role': 'Reporter',
                   'scope': 'Read',
                   'PhoneNumber': '1234455',
                   'isEditEnabled': true,
                   'isEditSelfEmailIdEnabled': false,
                   'isEditPhoneNoEnabled': false
               }
           ];
           userService.updateUsersDetail(mockdata).subscribe((data: any) => {
               expect(data).toEqual(mockdata.length);
               const req = httpMock.expectOne(`${appService.nodeUrl}/updateUsersDetail`, 'call to api');
               expect(req.request.method).toBe('POST');
               req.flush(mockdata);
               httpMock.verify();
           });
       });
       fit('Check if the user already exists in the database using the username provided by the user', () => {
           const mockdata = {
               'userId': 18,
               'userName': 'amritha',
           };
           const inputData = 'amritha';
           userService.getUserByUsername(inputData).subscribe((res) => {
               expect(res).toBeDefined();
               expect(res).toEqual(mockdata, 'result matched');
               const req = httpMock.expectOne(`${appService.nodeUrl}/getUserByUsername`, 'call to api');
               expect(req.request.method).toBe('GET');
               req.flush(mockdata);
               httpMock.verify();
           });
       });
       fit('check if password is inValid for the logged in user while log in', () => {
           httpClientSpy.get.and.returnValue(asyncData(false));
           const inputData = { username: 'admin', password: '12345' };
           userService.checkIfPasswordIsInValid(inputData).subscribe((res) =>
               expect(res).toEqual(1)
           );
       });
       // fit('TEST', () => {
       //     const data = false;
       //     expect(1).toEqual(data);
       // });
       fit('check if password is valid for the logged in user while log in', () => {
           httpClientSpy.get.and.returnValue(asyncData(true));
           const inputData = { username: 'admin', password: '123' };
           userService.checkIfPasswordIsInValid(inputData).subscribe((res) => {
               expect(res).toBeDefined();
               expect(res).toEqual(true);
           });
       });
       fit('updating the phone number and email address of the logged in user by logged in user', () => {
           const inputData = { userId: 16, emailId: 'ab@siemens.com', phoneNumber: '12345678' };
           const mockdata = inputData;
           userService.updateselfDetails(inputData).subscribe((res) => {
               expect(res).toBeDefined();
               expect(res).toEqual(mockdata, 'result matched');
               const req = httpMock.expectOne(`${appService.nodeUrl}/updateselfDetails`, 'call to api');
               expect(req.request.method).toBe('POST');
               req.flush(mockdata);
               httpMock.verify();
           });
       });
       fit('updating the User Password when requested for the chnage of password', () => {
           const inputData = { userId: 16, emailId: 'ab@siemens.com', phoneNumber: '12345678' };
           const mockdata = inputData;
           userService.updateUserPassword(inputData).subscribe((res) => {
               expect(res).toBeDefined();
               expect(res).toEqual(mockdata, 'result matched');
               const req = httpMock.expectOne(`${appService.nodeUrl}/updateselfDetails`, 'call to api');
               expect(req.request.method).toBe('POST');
               req.flush(mockdata);
               httpMock.verify();
           });
       });*/
});
