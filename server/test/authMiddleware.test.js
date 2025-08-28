import chai from "chai";
import sinon from "sinon";
const expect = chai.expect;
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

describe("Auth Middleware", () => {
  let req, res, next, userFindByIdStub;

  beforeEach(() => {
    req = {
      auth: {},
      user: null,
    };
    res = {
      json: sinon.stub(),
    };
    next = sinon.stub();

    userFindByIdStub = sinon.stub(User, "findById");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should call next if userId is present and user is found", async () => {
    req.auth.userId = "user123";
    const mockUser = { _id: "user123", name: "Test User" };
    userFindByIdStub.returns(mockUser);

    await protect(req, res, next);

    expect(userFindByIdStub.calledOnceWith("user123")).to.be.true;
    expect(req.user).to.deep.equal(mockUser);
    expect(next.calledOnce).to.be.true;
    expect(res.json.notCalled).to.be.true;
  });

  it("should return not authenticated if userId is not present", async () => {
    req.auth.userId = null; // No userId

    await protect(req, res, next);

    expect(userFindByIdStub.notCalled).to.be.true;
    expect(next.notCalled).to.be.true;
    expect(
      res.json.calledWith({ success: false, message: "not authenticated" })
    ).to.be.true;
  });

  it("should set req.user to null if user is not found, but still call next", async () => {
    req.auth.userId = "user123";
    userFindByIdStub.returns(null);

    await protect(req, res, next);

    expect(userFindByIdStub.calledOnceWith("user123")).to.be.true;
    expect(req.user).to.be.null;
    expect(next.calledOnce).to.be.true;
    expect(res.json.notCalled).to.be.true;
  });
});
