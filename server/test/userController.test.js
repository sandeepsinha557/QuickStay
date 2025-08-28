import chai from "chai";
import sinon from "sinon";
const expect = chai.expect;
import { storeRecentSearchedCities } from "../controllers/userController.js";
import User from "../models/User.js";

describe("User Controller", () => {
  let req, res, userSaveStub;

  beforeEach(() => {
    req = {
      user: {
        recentSearchedCities: [],
        save: () => {},
      },
      body: {},
    };
    res = {
      json: sinon.stub(),
    };
    userSaveStub = sinon.stub(req.user, "save");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should add a city to recentSearchedCities if less than 3 cities are stored", async () => {
    req.body.recentSearchedCity = "London";
    await storeRecentSearchedCities(req, res);

    expect(req.user.recentSearchedCities).to.include("London");
    expect(req.user.recentSearchedCities).to.have.lengthOf(1);
    expect(userSaveStub.calledOnce).to.be.true;
    expect(res.json.calledWith({ success: true, message: "City added" })).to.be
      .true;
  });

  it("should replace the oldest city if 3 cities are already stored", async () => {
    req.user.recentSearchedCities = ["London", "Paris", "New York"];
    req.body.recentSearchedCity = "Tokyo";
    await storeRecentSearchedCities(req, res);

    expect(req.user.recentSearchedCities).to.not.include("London");
    expect(req.user.recentSearchedCities).to.include("Paris");
    expect(req.user.recentSearchedCities).to.include("New York");
    expect(req.user.recentSearchedCities).to.include("Tokyo");
    expect(req.user.recentSearchedCities).to.have.lengthOf(3);
    expect(userSaveStub.calledOnce).to.be.true;
    expect(res.json.calledWith({ success: true, message: "City added" })).to.be
      .true;
  });

  it("should return success: false if an error occurs", async () => {
    userSaveStub.throws(new Error("Save failed"));
    req.body.recentSearchedCity = "London";

    await storeRecentSearchedCities(req, res);

    expect(res.json.calledWith({ success: false, message: "Save failed" })).to
      .be.true;
  });
});
