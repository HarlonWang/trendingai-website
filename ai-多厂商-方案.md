
## 十二、第三家：智谱 GLM 直连（2026-09-22，api PR #57）

拍板：**接官方智谱，不走阿里百炼网关。** 百炼路线（一把 key 同时拿 Qwen / GLM-5.3 / Kimi-K3、五个海外区域、支付宝充值）已评估，用户明确先不走。展示名 Zhipu AI（BigModel 是平台名、Z.ai 是海外品牌，选择器里放的是厂商）。

### 12.1 接入前实测（26 次请求，全由 09-11 注册赠送的 200 万通用 tokens 承担，现金余额 0 仍可调用即为证明）

| # | 验证 | 结果 | 处置 |
|---|---|---|---|
| 1 | `/models` | 两套基址都有。`/api/v1/models` 恰是 Responses 可用的 3 个模型（glm-5.3、glm-5.3-flash、glm-5-turbo），带 `input_modalities` 与思考档，但形状是 `{ models: [{ slug }] }` | models.js 解析两种形状（一行），不做静态兜底 |
| 2 | effort none / low / max | none → 400「该模型始终思考」；low、max 都能答。模型页对、Responses 指南错 | `requestDefaults.reasoning.effort: 'low'` |
| 3 | 流式形状 | 有 `event:` 行、**有 `[DONE]`**（文档说没有）、以 `response.completed` 收尾，事件与 OpenAI 同构 | parser 零改 |
| 4 | 8192 预算 + effort max，难题 | **200 s、8190 token 全是思维链、正文 0 字、status incomplete** | 硬约束：只能 low |
| 10 | 同题 + effort low，流式 | 35 s 答完 2538 字，reasoning_tokens 0 | low 实际等于不思考 |
| 5 | 图片 | glm-5.3 返回 200 并说「无法查看图片」（静默丢）；flash 正确答「绿色」 | 5.3 `images: false` 靠 400 挡；flash `overrides.images: true` |
| 6 | web_search 流式 | 单 message 项、无 phase 旁白；`searching` 事件与 `web_search_call` done 项齐全（action 是 open_page/url，无 query 也有带 query 的）；`annotations` 恒空、链接内联正文；`max_tool_calls` 与 `search_context_size` 都接受 | `caps.search: true`；来源卡片不会出现，与 DeepSeek 搁置项同形 |
| 7 | 错误形状 | 400 / 429 是标准 HTTP 状态 + `{ error: { code, message } }`；只有 401 走 HTTP 200 包装（body `{code:401}`） | 不改公共层；无效 key 会记成 Empty completion，属运维错误 |
| 8 | 8 路并发（干净重跑） | 7 成 1 个 429 `rate_limit_exceeded`，排队最长 6 s | 并发上限约 7，三位 Pro 用户够用 |
| 9 | 首字延迟 | 流式 low 首字 1.0～2.1 s（搜索场景 30 s），吐字约 35 tok/s | 比 DeepSeek 慢，可接受 |
| 搜索单价 | 定价页 | Search-Std ¥0.01 / 次、Pro ¥0.03、Sogou ¥0.05；Responses 内 `web_search` 用哪一档未写 | `searchCallMicros` 按 Std 记，看账单再校 |

原始输出在会话 scratchpad `glm/`。海外出口（洛杉矶）直连 open.bigmodel.cn 首字节 80 ms，`relay: false`。

### 12.2 与 §五设计的差异

- 公共层唯一改动是目录形状容错；`store` 走 `requestDefaults` 覆盖（注册表头注释已写明这是 requestDefaults 的唯一覆盖例外）。
- 牌价人民币按 7.0 换微美元（¥8 / ¥28 / 缓存 ¥2 → 1_143_000 / 4_000_000 / 286_000），Flash 按标准价不按限时五折。
- 用仓库自己的 `callChat` + `parseResponsesEvents` 打真实上游冒烟：目录两条、文本流、搜索流（2 次计数、cached_tokens 归一）、Flash 看图均正确。

### 12.3 上线与配套

`wrangler secret put ZHIPU_API_KEY`（先于合并）→ 合并自动部署 → 生产验证（`diag-zhipu` 前缀）→ 官网隐私政策加智谱（website 已本地提交）。客户端零改动。

**未做 / 观察点**：赠送包 12-11 到期后要充值（余额预警未开，欠费即报错不会超支）；搜索实际计费档位看首月账单；用户若要 GLM 思考档，是客户端加开关 + 服务端透传的独立需求。
