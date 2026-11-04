const BASE = process.env.BASE || "http://localhost:3000";

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: BASE,
      referer: `${BASE}/`,
    },
    body: JSON.stringify(body),
    redirect: "manual",
  });
  const text = await res.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = { raw: text.slice(0, 400) };
  }
  return {
    status: res.status,
    payload,
    cookie: res.headers.get("set-cookie"),
  };
}

console.log("== health ==");
try {
  const h = await fetch(`${BASE}/api/auth/ok`);
  console.log("  /api/auth/ok =>", h.status, (await h.text()).slice(0, 200));
} catch (e) {
  console.log("  FETCH FAILED:", e.message);
}

console.log("\n== sign in (examiner) ==");
const signIn = await post("/api/auth/sign-in/email", {
  email: "examiner@studiospace.com",
  password: "Studio1234",
});
console.log("  status:", signIn.status);
console.log("  body  :", JSON.stringify(signIn.payload));
console.log("  cookie:", signIn.cookie ? "set" : "none");

console.log("\n== sign up (probe) ==");
const email = `why-fail-${Date.now()}@studiospace.com`;
const signUp = await post("/api/auth/sign-up/email", {
  name: "Why Fail",
  email,
  password: "Studio1234",
});
console.log("  email :", email);
console.log("  status:", signUp.status);
console.log("  body  :", JSON.stringify(signUp.payload));
console.log("  cookie:", signUp.cookie ? "set" : "none");

console.log("\n== sign in again as the probe ==");
const retry = await post("/api/auth/sign-in/email", {
  email,
  password: "Studio1234",
});
console.log("  status:", retry.status);
console.log("  body  :", JSON.stringify(retry.payload));
