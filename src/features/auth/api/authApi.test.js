import { describe, it, expect, vi } from "vitest";

vi.mock("../../../helpers/apiHelper.js", () => ({ api: vi.fn().mockResolvedValue("ok") }));
import { api } from "../../../helpers/apiHelper.js";
import { fetchProfile, loginUser, registerUser } from "./authApi.js";

describe("authApi", () => {
  it("memanggil endpoint yang tepat", async () => {
    await registerUser({ a: 1 });
    expect(api).toHaveBeenLastCalledWith("/auth/register", { method: "POST", body: { a: 1 }, auth: false });
    await loginUser({ b: 2 });
    expect(api).toHaveBeenLastCalledWith("/auth/login", { method: "POST", body: { b: 2 }, auth: false });
    expect(await fetchProfile()).toBe("ok");
    expect(api).toHaveBeenLastCalledWith("/users/me");
  });
});
