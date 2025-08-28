import chai from "chai";
import sinon from "sinon";
const expect = chai.expect;
import { registerHotel } from "../controllers/hotelController.js";
import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

describe("Hotel Controller", () => {
  let req, res, hotelFindOneStub, hotelCreateStub, userFindByIdAndUpdateStub;

  beforeEach(() => {
    req = {
      body: {
        name: "Test Hotel",
        address: "123 Test St",
        contact: "123-456-7890",
        city: "Testville",
      },
      user: {
        _id: "user123",
      },
    };
    res = {
      json: sinon.stub(),
    };

    hotelFindOneStub = sinon.stub(Hotel, "findOne");
    hotelCreateStub = sinon.stub(Hotel, "create");
    userFindByIdAndUpdateStub = sinon.stub(User, "findByIdAndUpdate");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should register a hotel and update user role if no hotel is already registered", async () => {
    hotelFindOneStub.returns(null);
    hotelCreateStub.returns({}); // Mock successful creation
    userFindByIdAndUpdateStub.returns({}); // Mock successful update

    await registerHotel(req, res);

    expect(hotelFindOneStub.calledOnceWith({ owner: "user123" })).to.be.true;
    expect(
      hotelCreateStub.calledOnceWith({
        name: "Test Hotel",
        address: "123 Test St",
        contact: "123-456-7890",
        city: "Testville",
        owner: "user123",
      })
    ).to.be.true;
    expect(
      userFindByIdAndUpdateStub.calledOnceWith("user123", {
        role: "hotelOwner",
      })
    ).to.be.true;
    expect(
      res.json.calledWith({
        success: true,
        message: "Hotel Registered Successfully",
      })
    ).to.be.true;
  });

  it("should return an error if a hotel is already registered by the user", async () => {
    hotelFindOneStub.returns({}); // Mock an existing hotel

    await registerHotel(req, res);

    expect(hotelFindOneStub.calledOnceWith({ owner: "user123" })).to.be.true;
    expect(hotelCreateStub.notCalled).to.be.true;
    expect(userFindByIdAndUpdateStub.notCalled).to.be.true;
    expect(
      res.json.calledWith({
        success: false,
        message: "Hotel Already Registered",
      })
    ).to.be.true;
  });

  it("should return success: false if an error occurs", async () => {
    hotelFindOneStub.throws(new Error("Database error"));

    await registerHotel(req, res);

    expect(res.json.calledWith({ success: false, message: "Database error" }))
      .to.be.true;
  });
});
