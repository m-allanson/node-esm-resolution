import { Env } from "@humanwhocodes/env";

const env = new Env({test: "my test value"});

const test = env.get("test");

console.log(test);