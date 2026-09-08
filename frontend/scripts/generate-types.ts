const { execSync } = require("child_process");

const OPENAPI_URL =
    process.env.OPENAPI_URL || "http://127.0.0.1:8000/openapi.json";
const OUTPUT_PATH = "lib/api-types.ts";

try {
    execSync(`npx openapi-typescript ${OPENAPI_URL} -o ${OUTPUT_PATH}`, {
        stdio: "inherit",
    });
    console.log(`✔ 타입 생성 완료: ${OUTPUT_PATH}`);
} catch (err) {
    console.warn(
        `⚠ 백엔드(${OPENAPI_URL})에 연결할 수 없어 타입 생성을 건너뜁니다. ` +
            `기존 ${OUTPUT_PATH}를 그대로 사용합니다. (백엔드를 켠 뒤 pnpm run generate:types로 수동 실행 가능)`,
    );
}
