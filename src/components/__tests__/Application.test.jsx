import React from "react";
import { render, cleanup } from "@testing-library/react";
import Application from "../Application.jsx";

afterEach(cleanup);

it("renders without crashing", async () => {
	render(<Application />);
});