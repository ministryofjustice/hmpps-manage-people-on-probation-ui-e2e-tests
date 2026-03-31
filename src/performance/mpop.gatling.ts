import {
    simulation,
    scenario,
    atOnceUsers,
    rampUsers,
    getEnvironmentVariable,
    group, pause,
} from "@gatling.io/core";
import { http, status } from "@gatling.io/http";

const baseUrl = getEnvironmentVariable("PERF_BASE_URL", "http://localhost:3000");
const cookieHeader = getEnvironmentVariable("PERF_COOKIE_HEADER", "");

const httpProtocol = http
    .baseUrl(baseUrl)
    .header("Cookie", cookieHeader);

export const mpopJourney = group("mpop").on(
    http("GET home page")
        .get("/")
        .check(status().is(200)),

    pause(1), // 1 second think time

    http("GET overview")
        .get("/case/X756510")
        .check(status().is(200))
);

export default simulation((setUp) => {
    const scn = scenario("mpop journey")
        .exitBlockOnFail()
        .on(mpopJourney)
        .exitHereIfFailed();

    setUp(
        scn.injectOpen(
            atOnceUsers(1),
            rampUsers(5).during(30)
        )
    ).protocols(httpProtocol);
});