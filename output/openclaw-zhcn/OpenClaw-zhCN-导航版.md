# OpenClaw 中文文档导航版（目录+摘要）

> 说明：基于 `docs/zh-CN` 自动生成。正文原文汇编见同目录 `OpenClaw-zhCN-原文汇编.*`。

- 文档总数（md/mdx）：**311**

## 目录总览
- automation (8)
- channels (28)
- cli (41)
- concepts (28)
- debug (1)
- diagnostics (1)
- experiments (6)
- gateway (29)
- help (7)
- install (19)
- nodes (9)
- platforms (27)
- plugins (4)
- providers (21)
- refactor (5)
- reference (24)
- root (12)
- security (1)
- start (11)
- tools (24)
- web (5)

## automation
- **认证监控**
  路径：`automation/auth-monitoring.md`
  摘要：read_when:
- **定时任务（Gateway网关调度器）**
  路径：`automation/cron-jobs.md`
  摘要：read_when:
- **定时任务与心跳：何时使用哪种方式**
  路径：`automation/cron-vs-heartbeat.md`
  摘要：read_when:
- **Gmail Pub/Sub -> OpenClaw**
  路径：`automation/gmail-pubsub.md`
  摘要：read_when:
- **Hooks**
  路径：`automation/hooks.md`
  摘要：read_when:
- **投票**
  路径：`automation/poll.md`
  摘要：read_when:
- **自动化故障排查**
  路径：`automation/troubleshooting.md`
  摘要：summary: 自动化故障排查：排查 cron 和 heartbeat 调度与投递问题
- **Webhooks**
  路径：`automation/webhook.md`
  摘要：read_when:

## channels
- **BlueBubbles（macOS REST）**
  路径：`channels/bluebubbles.md`
  摘要：read_when:
- **广播群组**
  路径：`channels/broadcast-groups.md`
  摘要：read_when:
- **渠道与路由**
  路径：`channels/channel-routing.md`
  摘要：read_when:
- **Discord（Bot API）**
  路径：`channels/discord.md`
  摘要：read_when:
- **飞书机器人**
  路径：`channels/feishu.md`
  摘要：summary: "飞书机器人支持状态、功能和配置"
- **Google Chat（Chat API）**
  路径：`channels/googlechat.md`
  摘要：read_when:
- **grammY 集成（Telegram Bot API）**
  路径：`channels/grammy.md`
  摘要：read_when:
- **群组消息（WhatsApp 网页渠道）**
  路径：`channels/group-messages.md`
  摘要：read_when:
- **群组**
  路径：`channels/groups.md`
  摘要：read_when:
- **iMessage (imsg)**
  路径：`channels/imessage.md`
  摘要：read_when:
- **聊天渠道**
  路径：`channels/index.md`
  摘要：read_when:
- **LINE（插件）**
  路径：`channels/line.md`
  摘要：read_when:
- **渠道位置解析**
  路径：`channels/location.md`
  摘要：read_when:
- **Matrix（插件）**
  路径：`channels/matrix.md`
  摘要：read_when:
- **Mattermost（插件）**
  路径：`channels/mattermost.md`
  摘要：read_when:
- **Microsoft Teams（插件）**
  路径：`channels/msteams.md`
  摘要：read_when:
- **Nextcloud Talk（插件）**
  路径：`channels/nextcloud-talk.md`
  摘要：read_when:
- **Nostr**
  路径：`channels/nostr.md`
  摘要：read_when:
- **配对**
  路径：`channels/pairing.md`
  摘要：read_when:
- **Signal (signal-cli)**
  路径：`channels/signal.md`
  摘要：read_when:
- **Slack**
  路径：`channels/slack.md`
  摘要：read_when: Setting up Slack or debugging Slack socket/HTTP mode
- **Telegram（Bot API）**
  路径：`channels/telegram.md`
  摘要：read_when:
- **Tlon（插件）**
  路径：`channels/tlon.md`
  摘要：read_when:
- **渠道故障排除**
  路径：`channels/troubleshooting.md`
  摘要：read_when:
- **Twitch（插件）**
  路径：`channels/twitch.md`
  摘要：read_when:
- **WhatsApp（网页渠道）**
  路径：`channels/whatsapp.md`
  摘要：read_when:
- **Zalo (Bot API)**
  路径：`channels/zalo.md`
  摘要：read_when:
- **Zalo Personal（非官方）**
  路径：`channels/zalouser.md`
  摘要：read_when:

## cli
- **acp**
  路径：`cli/acp.md`
  摘要：read_when:
- **`openclaw agent`**
  路径：`cli/agent.md`
  摘要：read_when:
- **`openclaw agents`**
  路径：`cli/agents.md`
  摘要：read_when:
- **`openclaw approvals`**
  路径：`cli/approvals.md`
  摘要：read_when:
- **`openclaw browser`**
  路径：`cli/browser.md`
  摘要：read_when:
- **`openclaw channels`**
  路径：`cli/channels.md`
  摘要：read_when:
- **`openclaw config`**
  路径：`cli/config.md`
  摘要：read_when:
- **`openclaw configure`**
  路径：`cli/configure.md`
  摘要：read_when:
- **`openclaw cron`**
  路径：`cli/cron.md`
  摘要：read_when:
- **`openclaw dashboard`**
  路径：`cli/dashboard.md`
  摘要：read_when:
- **`openclaw devices`**
  路径：`cli/devices.md`
  摘要：read_when:
- **`openclaw directory`**
  路径：`cli/directory.md`
  摘要：read_when:
- **`openclaw dns`**
  路径：`cli/dns.md`
  摘要：read_when:
- **`openclaw docs`**
  路径：`cli/docs.md`
  摘要：read_when:
- **`openclaw doctor`**
  路径：`cli/doctor.md`
  摘要：read_when:
- **Gateway 网关 CLI**
  路径：`cli/gateway.md`
  摘要：read_when:
- **`openclaw health`**
  路径：`cli/health.md`
  摘要：read_when:
- **`openclaw hooks`**
  路径：`cli/hooks.md`
  摘要：read_when:
- **CLI 参考**
  路径：`cli/index.md`
  摘要：read_when:
- **`openclaw logs`**
  路径：`cli/logs.md`
  摘要：read_when:
- **`openclaw memory`**
  路径：`cli/memory.md`
  摘要：read_when:
- **`openclaw message`**
  路径：`cli/message.md`
  摘要：read_when:
- **`openclaw models`**
  路径：`cli/models.md`
  摘要：read_when:
- **`openclaw node`**
  路径：`cli/node.md`
  摘要：read_when:
- **`openclaw nodes`**
  路径：`cli/nodes.md`
  摘要：read_when:
- **`openclaw onboard`**
  路径：`cli/onboard.md`
  摘要：read_when:
- **`openclaw pairing`**
  路径：`cli/pairing.md`
  摘要：read_when:
- **`openclaw plugins`**
  路径：`cli/plugins.md`
  摘要：read_when:
- **`openclaw reset`**
  路径：`cli/reset.md`
  摘要：read_when:
- **沙箱 CLI**
  路径：`cli/sandbox.md`
  摘要：read_when: You are managing sandbox containers or debugging sandbox/tool-policy behavior.
- **`openclaw security`**
  路径：`cli/security.md`
  摘要：read_when:
- **`openclaw sessions`**
  路径：`cli/sessions.md`
  摘要：read_when:
- **`openclaw setup`**
  路径：`cli/setup.md`
  摘要：read_when:
- **`openclaw skills`**
  路径：`cli/skills.md`
  摘要：read_when:
- **`openclaw status`**
  路径：`cli/status.md`
  摘要：read_when:
- **`openclaw system`**
  路径：`cli/system.md`
  摘要：read_when:
- **`openclaw tui`**
  路径：`cli/tui.md`
  摘要：read_when:
- **`openclaw uninstall`**
  路径：`cli/uninstall.md`
  摘要：read_when:
- **`openclaw update`**
  路径：`cli/update.md`
  摘要：read_when:
- **`openclaw voicecall`**
  路径：`cli/voicecall.md`
  摘要：read_when:
- **`openclaw webhooks`**
  路径：`cli/webhooks.md`
  摘要：read_when:

## concepts
- **智能体循环（OpenClaw）**
  路径：`concepts/agent-loop.md`
  摘要：read_when:
- **智能体工作区**
  路径：`concepts/agent-workspace.md`
  摘要：read_when:
- **智能体运行时 🤖**
  路径：`concepts/agent.md`
  摘要：read_when:
- **Gateway 网关架构**
  路径：`concepts/architecture.md`
  摘要：read_when:
- **上下文窗口与压缩**
  路径：`concepts/compaction.md`
  摘要：read_when:
- **上下文**
  路径：`concepts/context.md`
  摘要：read_when:
- **亮点**
  路径：`concepts/features.md`
  摘要：read_when:
- **Markdown 格式化**
  路径：`concepts/markdown-formatting.md`
  摘要：read_when:
- **记忆**
  路径：`concepts/memory.md`
  摘要：read_when:
- **消息**
  路径：`concepts/messages.md`
  摘要：read_when:
- **模型故障转移**
  路径：`concepts/model-failover.md`
  摘要：read_when:
- **模型提供商**
  路径：`concepts/model-providers.md`
  摘要：read_when:
- **模型 CLI**
  路径：`concepts/models.md`
  摘要：read_when:
- **多智能体路由**
  路径：`concepts/multi-agent.md`
  摘要：read_when: You want multiple isolated agents (workspaces + auth) in one gateway process.
- **OAuth**
  路径：`concepts/oauth.md`
  摘要：read_when:
- **在线状态**
  路径：`concepts/presence.md`
  摘要：read_when:
- **命令队列（2026-01-16）**
  路径：`concepts/queue.md`
  摘要：read_when:
- **重试策略**
  路径：`concepts/retry.md`
  摘要：read_when:
- **会话剪枝**
  路径：`concepts/session-pruning.md`
  摘要：read_when:
- **会话工具**
  路径：`concepts/session-tool.md`
  摘要：read_when:
- **会话管理**
  路径：`concepts/session.md`
  摘要：read_when:
- **会话**
  路径：`concepts/sessions.md`
  摘要：read_when:
- **流式传输 + 分块**
  路径：`concepts/streaming.md`
  摘要：read_when:
- **系统提示词**
  路径：`concepts/system-prompt.md`
  摘要：read_when:
- **时区**
  路径：`concepts/timezone.md`
  摘要：read_when:
- **TypeBox 作为协议的事实来源**
  路径：`concepts/typebox.md`
  摘要：read_when:
- **输入指示器**
  路径：`concepts/typing-indicators.md`
  摘要：read_when:
- **使用量跟踪**
  路径：`concepts/usage-tracking.md`
  摘要：read_when:

## debug
- **Node + tsx "\_\_name is not a function" 崩溃**
  路径：`debug/node-issue.md`
  摘要：read_when:

## diagnostics
- **诊断标志**
  路径：`diagnostics/flags.md`
  摘要：read_when:

## experiments
- **新手引导 + 配置协议**
  路径：`experiments/onboarding-config-protocol.md`
  摘要：read_when: Changing onboarding wizard steps or config schema endpoints
- **Cron Add 加固 & Schema 对齐**
  路径：`experiments/plans/cron-add-hardening.md`
  摘要：last_updated: "2026-01-05"
- **Telegram 允许列表加固**
  路径：`experiments/plans/group-policy-hardening.md`
  摘要：read_when:
- **OpenResponses Gateway 网关集成计划**
  路径：`experiments/plans/openresponses-gateway.md`
  摘要：last_updated: "2026-01-19"
- **模型配置（探索）**
  路径：`experiments/proposals/model-config.md`
  摘要：read_when:
- **工作区记忆 v2（离线）：研究笔记**
  路径：`experiments/research/memory.md`
  摘要：read_when:

## gateway
- **认证**
  路径：`gateway/authentication.md`
  摘要：read_when:
- **后台 Exec + Process 工具**
  路径：`gateway/background-process.md`
  摘要：read_when:
- **Bonjour / mDNS 设备发现**
  路径：`gateway/bonjour.md`
  摘要：read_when:
- **Bridge 协议（旧版节点传输）**
  路径：`gateway/bridge-protocol.md`
  摘要：read_when:
- **CLI 后端（回退运行时）**
  路径：`gateway/cli-backends.md`
  摘要：read_when:
- **配置示例**
  路径：`gateway/configuration-examples.md`
  摘要：read_when:
- **配置 🔧**
  路径：`gateway/configuration.md`
  摘要：read_when:
- **设备发现 & 传输协议**
  路径：`gateway/discovery.md`
  摘要：read_when:
- **Doctor**
  路径：`gateway/doctor.md`
  摘要：read_when:
- **Gateway 网关锁**
  路径：`gateway/gateway-lock.md`
  摘要：read_when:
- **健康检查（CLI）**
  路径：`gateway/health.md`
  摘要：read_when:
- **心跳（Gateway 网关）**
  路径：`gateway/heartbeat.md`
  摘要：read_when:
- **Gateway 网关服务运行手册**
  路径：`gateway/index.md`
  摘要：read_when:
- **本地模型**
  路径：`gateway/local-models.md`
  摘要：read_when:
- **日志**
  路径：`gateway/logging.md`
  摘要：read_when:
- **多 Gateway 网关（同一主机）**
  路径：`gateway/multiple-gateways.md`
  摘要：read_when:
- **核心规则**
  路径：`gateway/network-model.md`
  摘要：read_when:
- **OpenAI Chat Completions（HTTP）**
  路径：`gateway/openai-http-api.md`
  摘要：read_when:
- **OpenResponses API（HTTP）**
  路径：`gateway/openresponses-http-api.md`
  摘要：read_when:
- **Gateway 网关拥有的配对（选项 B）**
  路径：`gateway/pairing.md`
  摘要：read_when:
- **Gateway 网关协议（WebSocket）**
  路径：`gateway/protocol.md`
  摘要：read_when:
- **使用远程 Gateway 网关运行 OpenClaw.app**
  路径：`gateway/remote-gateway-readme.md`
  摘要：read_when: Connecting the macOS app to a remote gateway over SSH
- **远程访问（SSH、隧道和 tailnet）**
  路径：`gateway/remote.md`
  摘要：read_when:
- **沙箱 vs 工具策略 vs 提权**
  路径：`gateway/sandbox-vs-tool-policy-vs-elevated.md`
  摘要：read_when: You hit 'sandbox jail' or see a tool/elevated refusal and want the exact config key to ch…
- **沙箱隔离**
  路径：`gateway/sandboxing.md`
  摘要：read_when: You want a dedicated explanation of sandboxing or need to tune agents.defaults.sandbox.
- **安全性 🔒**
  路径：`gateway/security/index.md`
  摘要：read_when:
- **Tailscale（Gateway 网关仪表盘）**
  路径：`gateway/tailscale.md`
  摘要：read_when:
- **工具调用（HTTP）**
  路径：`gateway/tools-invoke-http-api.md`
  摘要：read_when:
- **故障排除 🔧**
  路径：`gateway/troubleshooting.md`
  摘要：read_when:

## help
- **调试**
  路径：`help/debugging.md`
  摘要：read_when:
- **环境变量**
  路径：`help/environment.md`
  摘要：read_when:
- **常见问题**
  路径：`help/faq.md`
  摘要：summary: 关于 OpenClaw 安装、配置和使用的常见问题
- **帮助**
  路径：`help/index.md`
  摘要：read_when:
- **脚本**
  路径：`help/scripts.md`
  摘要：read_when:
- **测试**
  路径：`help/testing.md`
  摘要：read_when:
- **故障排除**
  路径：`help/troubleshooting.md`
  摘要：read_when:

## install
- **Ansible 安装**
  路径：`install/ansible.md`
  摘要：read_when:
- **Bun（实验性）**
  路径：`install/bun.md`
  摘要：read_when:
- **开发渠道**
  路径：`install/development-channels.md`
  摘要：read_when:
- **Docker（可选）**
  路径：`install/docker.md`
  摘要：read_when:
- **exe.dev**
  路径：`install/exe-dev.md`
  摘要：read_when:
- **Fly.io 部署**
  路径：`install/fly.md`
  摘要：description: Deploy OpenClaw on Fly.io
- **在 GCP Compute Engine 上运行 OpenClaw（Docker，生产 VPS 指南）**
  路径：`install/gcp.md`
  摘要：read_when:
- **在 Hetzner 上运行 OpenClaw（Docker，生产 VPS 指南）**
  路径：`install/hetzner.md`
  摘要：read_when:
- **安装**
  路径：`install/index.md`
  摘要：read_when:
- **安装器内部机制**
  路径：`install/installer.md`
  摘要：read_when:
- **在 macOS 虚拟机上运行 OpenClaw（沙箱隔离）**
  路径：`install/macos-vm.md`
  摘要：read_when:
- **将 OpenClaw 迁移到新机器**
  路径：`install/migrating.md`
  摘要：read_when:
- **Nix 安装**
  路径：`install/nix.md`
  摘要：read_when:
- **Node.js**
  路径：`install/node.md`
  摘要：summary: Node.js 安装与配置（OpenClaw 版本要求、安装方式与 PATH 排错）
- **如何开始**
  路径：`install/northflank.mdx`
  摘要：title: 在 Northflank 上部署
- **快速检查清单（新用户）**
  路径：`install/railway.mdx`
  摘要：title: 在 Railway 上部署
- **前提条件**
  路径：`install/render.mdx`
  摘要：title: 在 Render 上部署
- **卸载**
  路径：`install/uninstall.md`
  摘要：read_when:
- **更新**
  路径：`install/updating.md`
  摘要：read_when:

## nodes
- **音频 / 语音消息 — 2026-01-17**
  路径：`nodes/audio.md`
  摘要：read_when:
- **相机捕获（智能体）**
  路径：`nodes/camera.md`
  摘要：read_when:
- **图像与媒体支持 — 2025-12-05**
  路径：`nodes/images.md`
  摘要：read_when:
- **节点**
  路径：`nodes/index.md`
  摘要：read_when:
- **位置命令（节点）**
  路径：`nodes/location-command.md`
  摘要：read_when:
- **媒体理解（入站）— 2026-01-17**
  路径：`nodes/media-understanding.md`
  摘要：read_when:
- **Talk 模式**
  路径：`nodes/talk.md`
  摘要：read_when:
- **节点故障排查**
  路径：`nodes/troubleshooting.md`
  摘要：summary: 节点故障排查：排查配对、前台限制、权限与工具调用失败
- **语音唤醒（全局唤醒词）**
  路径：`nodes/voicewake.md`
  摘要：read_when:

## platforms
- **Android 应用（节点）**
  路径：`platforms/android.md`
  摘要：read_when:
- **在 DigitalOcean 上运行 OpenClaw**
  路径：`platforms/digitalocean.md`
  摘要：read_when:
- **平台**
  路径：`platforms/index.md`
  摘要：read_when:
- **iOS 应用（节点）**
  路径：`platforms/ios.md`
  摘要：read_when:
- **Linux 应用**
  路径：`platforms/linux.md`
  摘要：read_when:
- **macOS 上的 Gateway 网关（外部 launchd）**
  路径：`platforms/mac/bundled-gateway.md`
  摘要：read_when:
- **Canvas（macOS 应用）**
  路径：`platforms/mac/canvas.md`
  摘要：read_when:
- **macOS 上的 Gateway 网关生命周期**
  路径：`platforms/mac/child-process.md`
  摘要：read_when:
- **macOS 开发者设置**
  路径：`platforms/mac/dev-setup.md`
  摘要：read_when:
- **macOS 上的健康检查**
  路径：`platforms/mac/health.md`
  摘要：read_when:
- **菜单栏图标状态**
  路径：`platforms/mac/icon.md`
  摘要：read_when:
- **日志（macOS）**
  路径：`platforms/mac/logging.md`
  摘要：read_when:
- **菜单栏状态逻辑**
  路径：`platforms/mac/menu-bar.md`
  摘要：read_when:
- **Peekaboo Bridge（macOS UI 自动化）**
  路径：`platforms/mac/peekaboo.md`
  摘要：read_when:
- **macOS 权限（TCC）**
  路径：`platforms/mac/permissions.md`
  摘要：read_when:
- **OpenClaw macOS 发布（Sparkle）**
  路径：`platforms/mac/release.md`
  摘要：read_when:
- **远程 OpenClaw（macOS ⇄ 远程主机）**
  路径：`platforms/mac/remote.md`
  摘要：read_when:
- **Mac 签名（调试构建）**
  路径：`platforms/mac/signing.md`
  摘要：read_when:
- **Skills（macOS）**
  路径：`platforms/mac/skills.md`
  摘要：read_when:
- **语音浮层生命周期（macOS）**
  路径：`platforms/mac/voice-overlay.md`
  摘要：read_when:
- **语音唤醒与按键通话**
  路径：`platforms/mac/voicewake.md`
  摘要：read_when:
- **WebChat（macOS 应用）**
  路径：`platforms/mac/webchat.md`
  摘要：read_when:
- **OpenClaw macOS IPC 架构**
  路径：`platforms/mac/xpc.md`
  摘要：read_when:
- **OpenClaw macOS 配套应用（菜单栏 + Gateway 网关代理）**
  路径：`platforms/macos.md`
  摘要：read_when:
- **在 Oracle Cloud（OCI）上运行 OpenClaw**
  路径：`platforms/oracle.md`
  摘要：read_when:
- **在 Raspberry Pi 上运行 OpenClaw**
  路径：`platforms/raspberry-pi.md`
  摘要：read_when:
- **Windows (WSL2)**
  路径：`platforms/windows.md`
  摘要：read_when:

## plugins
- **插件智能体工具**
  路径：`plugins/agent-tools.md`
  摘要：read_when:
- **插件清单（openclaw.plugin.json）**
  路径：`plugins/manifest.md`
  摘要：read_when:
- **Voice Call（插件）**
  路径：`plugins/voice-call.md`
  摘要：read_when:
- **Zalo Personal（插件）**
  路径：`plugins/zalouser.md`
  摘要：read_when:

## providers
- **Anthropic（Claude）**
  路径：`providers/anthropic.md`
  摘要：read_when:
- **Amazon Bedrock**
  路径：`providers/bedrock.md`
  摘要：read_when:
- **Claude Max API 代理**
  路径：`providers/claude-max-api-proxy.md`
  摘要：read_when:
- **Deepgram（音频转录）**
  路径：`providers/deepgram.md`
  摘要：read_when:
- **GitHub Copilot**
  路径：`providers/github-copilot.md`
  摘要：read_when:
- **GLM 模型**
  路径：`providers/glm.md`
  摘要：read_when:
- **模型提供商**
  路径：`providers/index.md`
  摘要：read_when:
- **MiniMax**
  路径：`providers/minimax.md`
  摘要：read_when:
- **模型提供商**
  路径：`providers/models.md`
  摘要：read_when:
- **Moonshot AI (Kimi)**
  路径：`providers/moonshot.md`
  摘要：read_when:
- **Ollama**
  路径：`providers/ollama.md`
  摘要：read_when:
- **OpenAI**
  路径：`providers/openai.md`
  摘要：read_when:
- **OpenCode Zen**
  路径：`providers/opencode.md`
  摘要：read_when:
- **OpenRouter**
  路径：`providers/openrouter.md`
  摘要：read_when:
- **千帆（Qianfan）**
  路径：`providers/qianfan.md`
  摘要：summary: 使用千帆统一 API 在 OpenClaw 中接入多种模型
- **Qwen**
  路径：`providers/qwen.md`
  摘要：read_when:
- **Synthetic**
  路径：`providers/synthetic.md`
  摘要：read_when:
- **Venice AI（Venice 精选）**
  路径：`providers/venice.md`
  摘要：read_when:
- **Vercel AI Gateway**
  路径：`providers/vercel-ai-gateway.md`
  摘要：read_when:
- **Xiaomi MiMo**
  路径：`providers/xiaomi.md`
  摘要：read_when:
- **Z.AI**
  路径：`providers/zai.md`
  摘要：read_when:

## refactor
- **Clawnet 重构（协议 + 认证统一）**
  路径：`refactor/clawnet.md`
  摘要：read_when:
- **Exec 主机重构计划**
  路径：`refactor/exec-host.md`
  摘要：read_when:
- **出站会话镜像重构（Issue #1520）**
  路径：`refactor/outbound-session-mirroring.md`
  摘要：description: Track outbound session mirroring refactor notes, decisions, tests, and open items.
- **插件 SDK + 运行时重构计划**
  路径：`refactor/plugin-sdk.md`
  摘要：read_when:
- **严格配置验证（仅通过 doctor 进行迁移）**
  路径：`refactor/strict-config.md`
  摘要：read_when:

## reference
- **AGENTS.md — OpenClaw 个人助手（默认）**
  路径：`reference/AGENTS.default.md`
  摘要：read_when:
- **发布清单（npm + macOS）**
  路径：`reference/RELEASING.md`
  摘要：read_when:
- **API 用量与费用**
  路径：`reference/api-usage-costs.md`
  摘要：read_when:
- **名称由来**
  路径：`reference/credits.md`
  摘要：read_when:
- **设备型号数据库（友好名称）**
  路径：`reference/device-models.md`
  摘要：read_when:
- **RPC 适配器**
  路径：`reference/rpc.md`
  摘要：read_when:
- **会话管理与压缩（深入了解）**
  路径：`reference/session-management-compaction.md`
  摘要：read_when:
- **AGENTS.md - OpenClaw 工作区**
  路径：`reference/templates/AGENTS.dev.md`
  摘要：read_when:
- **AGENTS.md - 你的工作区**
  路径：`reference/templates/AGENTS.md`
  摘要：read_when:
- **BOOT.md**
  路径：`reference/templates/BOOT.md`
  摘要：read_when:
- **BOOTSTRAP.md - Hello, World**
  路径：`reference/templates/BOOTSTRAP.md`
  摘要：read_when:
- **HEARTBEAT.md**
  路径：`reference/templates/HEARTBEAT.md`
  摘要：read_when:
- **IDENTITY.md - 智能体身份**
  路径：`reference/templates/IDENTITY.dev.md`
  摘要：read_when:
- **IDENTITY.md - 我是谁？**
  路径：`reference/templates/IDENTITY.md`
  摘要：read_when:
- **SOUL.md - C-3PO 的灵魂**
  路径：`reference/templates/SOUL.dev.md`
  摘要：read_when:
- **SOUL.md - 你是谁**
  路径：`reference/templates/SOUL.md`
  摘要：read_when:
- **TOOLS.md - 用户工具备注（可编辑）**
  路径：`reference/templates/TOOLS.dev.md`
  摘要：read_when:
- **TOOLS.md - 本地备注**
  路径：`reference/templates/TOOLS.md`
  摘要：read_when:
- **USER.md - 用户档案**
  路径：`reference/templates/USER.dev.md`
  摘要：read_when:
- **USER.md - 关于你的用户**
  路径：`reference/templates/USER.md`
  摘要：read_when:
- **测试**
  路径：`reference/test.md`
  摘要：read_when:
- **Token 使用与成本**
  路径：`reference/token-use.md`
  摘要：read_when:
- **对话记录清理（提供商修正）**
  路径：`reference/transcript-hygiene.md`
  摘要：read_when:
- **向导参考**
  路径：`reference/wizard.md`
  摘要：summary: Onboarding 向导参考：完整步骤、参数与配置字段

## root
- **AGENTS.md - zh-CN 文档翻译工作区**
  路径：`AGENTS.md`
  摘要：- 维护 `docs/zh-CN/**`
- **Brave Search API**
  路径：`brave-search.md`
  摘要：read_when:
- **日期与时间**
  路径：`date-time.md`
  摘要：read_when:
- **OpenClaw 🦞**
  路径：`index.md`
  摘要：read_when:
- **日志**
  路径：`logging.md`
  摘要：read_when:
- **网络中心**
  路径：`network.md`
  摘要：read_when:
- **Perplexity Sonar**
  路径：`perplexity.md`
  摘要：read_when:
- **Pi 开发工作流程**
  路径：`pi-dev.md`
  摘要：title: Pi 开发工作流程
- **Pi 集成架构**
  路径：`pi.md`
  摘要：title: Pi 集成架构
- **OpenProse**
  路径：`prose.md`
  摘要：read_when:
- **文本转语音（TTS）**
  路径：`tts.md`
  摘要：read_when:
- **VPS 托管**
  路径：`vps.md`
  摘要：read_when:

## security
- **形式化验证（安全模型）**
  路径：`security/formal-verification.md`
  摘要：permalink: /security/formal-verification/

## start
- **智能体引导**
  路径：`start/bootstrapping.md`
  摘要：summary: 智能体引导流程：首次运行时如何初始化工作区与身份文件
- **从这里开始**
  路径：`start/docs-directory.md`
  摘要：read_when:
- **入门指南**
  路径：`start/getting-started.md`
  摘要：read_when:
- **文档导航中心**
  路径：`start/hubs.md`
  摘要：read_when:
- **OpenClaw 的传说 🦞📖**
  路径：`start/lore.md`
  摘要：read_when:
- **新手引导（macOS 应用）**
  路径：`start/onboarding.md`
  摘要：read_when:
- **使用 OpenClaw 构建个人助手**
  路径：`start/openclaw.md`
  摘要：read_when:
- **安装**
  路径：`start/quickstart.md`
  摘要：read_when:
- **设置**
  路径：`start/setup.md`
  摘要：read_when:
- **案例展示**
  路径：`start/showcase.md`
  摘要：description: Real-world OpenClaw projects from the community
- **新手引导向导（CLI）**
  路径：`start/wizard.md`
  摘要：read_when:

## tools
- **`openclaw agent`（直接智能体运行）**
  路径：`tools/agent-send.md`
  摘要：read_when:
- **apply_patch 工具**
  路径：`tools/apply-patch.md`
  摘要：read_when:
- **浏览器故障排除（Linux）**
  路径：`tools/browser-linux-troubleshooting.md`
  摘要：read_when: Browser control fails on Linux, especially with snap Chromium
- **浏览器登录 + X/Twitter 发帖**
  路径：`tools/browser-login.md`
  摘要：read_when:
- **浏览器（openclaw 托管）**
  路径：`tools/browser.md`
  摘要：read_when:
- **Chrome 扩展（浏览器中继）**
  路径：`tools/chrome-extension.md`
  摘要：read_when:
- **ClawHub**
  路径：`tools/clawhub.md`
  摘要：read_when:
- **创建自定义 Skills 🛠**
  路径：`tools/creating-skills.md`
  摘要：title: 创建 Skills
- **提升模式（/elevated 指令）**
  路径：`tools/elevated.md`
  摘要：read_when:
- **执行审批**
  路径：`tools/exec-approvals.md`
  摘要：read_when:
- **Exec 工具**
  路径：`tools/exec.md`
  摘要：read_when:
- **Firecrawl**
  路径：`tools/firecrawl.md`
  摘要：read_when:
- **工具（OpenClaw）**
  路径：`tools/index.md`
  摘要：read_when:
- **LLM 任务**
  路径：`tools/llm-task.md`
  摘要：read_when:
- **Lobster**
  路径：`tools/lobster.md`
  摘要：description: Typed workflow runtime for OpenClaw — composable pipelines with approval gates.
- **多智能体沙箱与工具配置**
  路径：`tools/multi-agent-sandbox-tools.md`
  摘要：read_when: You want per-agent sandboxing or per-agent tool allow/deny policies in a multi-agent gate…
- **插件（扩展）**
  路径：`tools/plugin.md`
  摘要：read_when:
- **表情回应工具**
  路径：`tools/reactions.md`
  摘要：read_when:
- **Skills 配置**
  路径：`tools/skills-config.md`
  摘要：read_when:
- **Skills（OpenClaw）**
  路径：`tools/skills.md`
  摘要：read_when:
- **斜杠命令**
  路径：`tools/slash-commands.md`
  摘要：read_when:
- **子智能体**
  路径：`tools/subagents.md`
  摘要：read_when:
- **思考级别（/think 指令）**
  路径：`tools/thinking.md`
  摘要：read_when:
- **Web 工具**
  路径：`tools/web.md`
  摘要：read_when:

## web
- **控制 UI（浏览器）**
  路径：`web/control-ui.md`
  摘要：read_when:
- **仪表板（控制 UI）**
  路径：`web/dashboard.md`
  摘要：read_when:
- **Web（Gateway 网关）**
  路径：`web/index.md`
  摘要：read_when:
- **TUI（终端 UI）**
  路径：`web/tui.md`
  摘要：read_when:
- **WebChat（Gateway 网关 WebSocket UI）**
  路径：`web/webchat.md`
  摘要：read_when:
