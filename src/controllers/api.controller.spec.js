require("mysql2/node_modules/iconv-lite").encodingExists("foo");

const request = require("supertest");
const app = require("../testEntry");
const faker = require("faker");

const { truncate } = require("../testHelper");

const { fake } = require("faker");

describe("Api Controller", () => {
  describe("Register API", () => {
    describe("Invalid body", () => {
      it("should fail without tutor ", async (done) => {
        const { statusCode, body } = await request(app).post("/api/register").send();
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ tutor: '"tutor" is required' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail without students ", async (done) => {
        const { statusCode, body } = await request(app).post("/api/register").send({
          tutor: 'tutor1@gmail.com'
        });
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ students: '"students" is required' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail if tutor is not an email", async (done) => {
        const { statusCode, body } = await request(app).post("/api/register").send({
          tutor: 'tutor1gmail.com'
        });
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ tutor: '"tutor" must be a valid email' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail if students are not in email format", async (done) => {
        const { statusCode, body } = await request(app).post("/api/register").send({
          tutor: 'tutor1@gmail.com', students:['asoidajsd']
        });
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ 0: "\"students[0]\" must be a valid email" }]);
        expect(statusCode).toEqual(400);
        done();
      });
    });

    describe("Valid body", () => {
      it("should pass for new tutor and students", async (done) => {
        const { statusCode, body } = await request(app).post("/api/register").send({
          tutor: 'tutor1@gmail.com',
          students:['student1@gmail.com']
        });
        
        expect(body).toEqual({})
        expect(statusCode).toEqual(204);
        done();
      });

      it("should pass for existing tutor and new students", async (done) => {
        const { statusCode, body } = await request(app).post("/api/register").send({
          tutor: 'tutor1@gmail.com',
           students:['student2@gmail.com', 'student3@gmail.com']});
        expect(body).toEqual({})
        expect(statusCode).toEqual(204);
        done();
      });

      it("should pass for new tutor and old students", async (done) => {
        const { statusCode, body } = await request(app).post("/api/register").send({
          tutor: 'tutor2@gmail.com', 
          students:['student1@gmail.com', 'student4@gmail.com']
        });
        expect(body).toEqual({})
        expect(statusCode).toEqual(204);
        done();
      });
    });
  });

  describe("GetCommonStudents API", () => {
    describe("Invalid query", () => {
      it("should fail without tutor ", async (done) => {
        const { statusCode, body } = await request(app).get("/api/getcommonstudents").send();
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ tutor: '"tutor" is required' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail if tutor is not an email ", async (done) => {
        const { statusCode, body } = await request(app).get("/api/getcommonstudents?tutor=asdaasd.com").send();
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ tutor: '"tutor" must be a valid email' }]);
        expect(statusCode).toEqual(400);
        done();
      });
    });

    describe("Valid query", () => {
      it("should pass for single common tutor ", async (done) => {
        const { statusCode, body } = await request(app).get("/api/getcommonstudents?tutor=tutor1@gmail.com").send();

        expect(body).toEqual({students:['student1@gmail.com', 'student3@gmail.com', 'student2@gmail.com']})
        expect(statusCode).toEqual(200);
        done();
      });

      it("should pass for multiple common tutor", async (done) => {
        const { statusCode, body } = await request(app).get("/api/getcommonstudents?tutor=tutor1@gmail.com&tutor=tutor2@gmail.com").send();

        expect(body).toEqual({students:['student1@gmail.com', 'student3@gmail.com', 'student2@gmail.com', 'student4@gmail.com']})
        expect(statusCode).toEqual(200);
        done();
      });
    });
  });

  describe("SuspendStudent API", () => {
    describe("Invalid body", () => {
      it("should fail without student", async (done) => {
        const { statusCode, body } = await request(app).post("/api/suspend").send();
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ student: '"student" is required' }]);
        expect(statusCode).toEqual(400);
        done();
      });
      it("should fail if student is not an email", async (done) => {
        const { statusCode, body } = await request(app).post("/api/suspend").send({
          student:"asdasd@asd"
        });
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ student: '"student" must be a valid email' }]);
        expect(statusCode).toEqual(400);
        done();
      });
    });

    describe("Valid body", () => {
      it("should fail for nonexistent student", async (done) => {
        const { statusCode, body } = await request(app).post("/api/suspend").send({
          student:'nonexistendstudent@gmail.com'
        });
        const { message } = body;

        expect(message).toEqual("Student not registered");
        expect(statusCode).toEqual(400);
        done();
      });
      it("should pass for existing student", async (done) => {
        const { statusCode } = await request(app).post("/api/suspend").send({
          student:'student1@gmail.com'
        });

        expect(statusCode).toEqual(204);
        done();
      });
    });
  });

  describe("RetrieveNotifications API", () => {
    describe("Invalid body", () => {
      it("should fail if tutor is empty", async (done) => {
        const { statusCode, body } = await request(app).post("/api/retrievenotifications").send();
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ tutor: '"tutor" is required' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail if notification is empty", async (done) => {
        const { statusCode, body } = await request(app).post("/api/retrievenotifications").send({
          tutor:"asdasd@gmail.com"
        });
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ notification: '"notification" is required' }]);
        expect(statusCode).toEqual(400);
        done();
      });
    });

    describe("Valid body", () => {
      it("should fail if tutor doesnt exist", async (done) => {
        const { statusCode, body } = await request(app).post("/api/retrievenotifications").send({
          tutor:'nonexistendtutor@gmail.com',
          notification: "Hello everyone"
        });
        const { message } = body;

        expect(message).toEqual("Tutor not registered");
        expect(statusCode).toEqual(400);
        done();
      });
  
      it("should pass and retrieve students that belongs to the tutor", async (done) => {
        const { statusCode, body } = await request(app).post("/api/retrievenotifications").send({
          tutor:'tutor2@gmail.com',
          notification: "Hello everyone"
        });

        expect(body).toEqual({recipients: ["student4@gmail.com"]})
        expect(statusCode).toEqual(200);
        done();
      });
  
      it("should pass and retrieve students that belongs to the tutor and mentioned students", async (done) => {
        const { statusCode, body } = await request(app).post("/api/retrievenotifications").send({
          tutor:'tutor2@gmail.com',
          notification: "Hello everyone and @student2@gmail.com"
        });

        expect(body).toEqual({recipients: ['student2@gmail.com', 'student4@gmail.com']})
        expect(statusCode).toEqual(200);
        done();
      });
  
      it("should pass and retrieve students that are not suspended only", async (done) => {
        const { statusCode, body } = await request(app).post("/api/retrievenotifications").send({
          tutor:'tutor1@gmail.com',
          notification: "Hello everyone and @student4@gmail.com"
        });

        expect(body).toEqual({recipients: ['student2@gmail.com','student3@gmail.com', 'student4@gmail.com']})
        expect(statusCode).toEqual(200);
        done();
      });
    });
  });
});
