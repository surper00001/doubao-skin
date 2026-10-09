# Doubao Skin Skill · 豆包换肤技能

> **来源与维护说明**：本项目是基于内部技能市场原版 `skills.byted.org/default/public@doubao-skin`（参照版本 1.0.3）的兼容性优化分支。原作者：飞书 AI Builder 姜犇（Ben）。原项目及本分支继续遵循 [MIT License](LICENSE)，原版权与许可文本完整保留。本分支由“内容质量公开技能库”维护，不代表原作者或豆包官方背书。

## 本分支的优化

- 兼容豆包 macOS 2.31.4，自动定位实际运行的客户端副本，包括 `/Applications`、`~/Applications`、桌面及其他路径。
- 避免机器上存在多份 `Doubao.app` 时关闭或启动错误副本。
- 调整客户端识别优先级，并适配 `aha-runtime` 占用默认 CDP 端口的新版运行环境。
- 将皮肤入口改为与豆包顶部工具栏一致的 26px 轻量线性调色盘图标按钮，使用原生设计变量、圆角和 8px 按钮间距。
- 重做“外观”面板：原生浮层色、标题/说明层级、双列主题卡片、独立自定义图片与恢复原生操作区。
- 将全部旧预设图片替换为 4 张原创现代抽象渐变背景；后续仍可上传自己的图片。
- 新增非标准安装路径和入口样式测试；当前完整测试集 16 项全部通过。

**给豆包与豆包工作桌面端换一个主题吧~**

一张图，一种心情 · 本机 CDP 注入 · 不改官方安装包 · macOS + Windows

非官方产品。不修改 `Doubao.app`、`DoubaoWork.app` / 安装目录 / 代码签名。

## 这是什么

一个给豆包（Doubao）和豆包工作（Doubao Work）桌面端换肤的工具。通过本机回环 CDP 把主题实时注入界面，不修改安装目录，不破坏应用签名，也不需要为每次客户端更新重新适配。

两个客户端都是 CEF/Chromium 内核。脚本会自动识别调用技能的客户端：豆包使用 `9333 + doubao-chat`，豆包工作使用 `9334 + doubaowork-chat`，只重启并注入当前客户端。

- **双客户端隔离**：豆包与豆包工作可以同时运行，进程、调试端口和 renderer 均独立识别
- **免重启注入**：对应客户端的 CDP 已就绪时直接换肤；不可用时才退出并重启当前客户端
- **一键切换**：应用皮肤后豆包右上角出现 🎨 菜单，所有已装主题和原生界面即点即换，零等待
- **自定义上传**：菜单里选「＋ 自定义图片」直接上传本地图片，自动按图片风格取色（主色、辅色、面板底色、文字色），即点即换；行尾 × 一键删除
- **一张图片就是一个主题**：任意 PNG、JPG、JPEG、WebP 直接生成皮肤（配色 + 背景底图）
- **深浅色自动适配**：根据主题配色的 surface 明度自动切换豆包原生的 `html[data-theme]`（light/dark），让豆包原生控件跟着深浅色变
- **双平台**：macOS（`.command`）+ Windows（`.ps1`）
- **随时还原**：暂停皮肤或切回原生界面，官方安装包始终原封不动

## 一句话安装（推荐）

本 skill 由豆包 / 豆包工作里的 Agent 直接调用。安装 = 把它放进客户端的 `.user_skills` 目录。两种方式任选：

**A. 在豆包 / 豆包工作里对 Agent 说一句话**（最省事，Agent 自己就能跑 git 和 shell）：

> 从 `https://github.com/surper00001/doubao-skin` 把 doubao-skin 装到我的 user_skills 目录，然后给这个客户端换肤

**B. 在终端跑一键脚本**（会自动定位所有豆包 / 豆包工作 workspace 并安装）：

```bash
curl -fsSL https://raw.githubusercontent.com/surper00001/doubao-skin/main/install.sh | bash
```

装好后，之后每次只要在客户端里说「帮我换肤」即可，无需再安装。

## 快速开始

需要已安装豆包或豆包工作桌面端。下载本仓库后：

> 在豆包 Agent Mode 中，用户安装的 Skill 位于 `.user_skills`（R2），系统内置 Skill 位于 `.skills`（R1）。执行时应以实际存在的 `SKILL.md` 所在目录为准，不要在两者之间猜测或硬编码路径。

从任一客户端运行本 Skill 时会自动选择该客户端。直接从终端调用时也可显式指定：

```bash
bash scripts/apply.command --client personal
bash scripts/apply.command --client work
```

```powershell
.\scripts\apply.ps1 -Client personal
.\scripts\apply.ps1 -Client work
```

## 主题切换菜单

应用皮肤后，豆包右上角会出现 🎨 按钮：

- 点击展开主题列表，点击任意主题即时切换
- 「＋ 自定义图片」上传本地图片生成主题（canvas 自动取色 + 压缩成 webp）
- 自定义主题行尾 × 一键删除
- 「原生界面」恢复官方外观（并还原换肤前的 `data-theme` 深浅色）

## 自定义主题

用任意图片创建主题：

```bash
node src/cli.mjs create --image "/path/to/hero.webp" --name "My Skin"
node src/cli.mjs apply --theme my-skin
```

或直接在 🎨 菜单里选「＋ 自定义图片」上传，自动取色并持久化（localStorage）。

## 极简主题格式

```json
{
  "schemaVersion": 1,
  "id": "my-skin",
  "name": "My Skin",
  "hero": "hero.webp",
  "colors": {
    "accent": "#24C9D7",
    "secondary": "#EF8FD3",
    "surface": "#F7FBFF",
    "text": "#17344F"
  }
}
```

只有 `schemaVersion`、`id`、`name` 和 `hero` 必填。图片必须位于主题目录内，颜色和文案（`copy`）都可省略。

- `surface` 的明度决定 light/dark 模式（亮度 > 140 为 light），自动切换豆包的 `html[data-theme]`
- `hero` 支持 PNG / JPG / JPEG / WebP

## 命令行

```bash
node src/cli.mjs list                              # 列出所有主题
node src/cli.mjs create --image PATH --name NAME   # 从图片创建主题
node src/cli.mjs apply [--theme ID] [--client personal|work] [--port PORT]
node src/cli.mjs status [--client personal|work]   # 查询注入状态
node src/cli.mjs pause [--client personal|work]    # 恢复原生
node src/cli.mjs doctor [--client personal|work]   # 检查客户端、路径和端口
```

## 内置主题

| 主题 id | 名称 | 风格 |
| --- | --- | --- |
| `mist-blue` | 雾蓝流光 | 雾蓝冰青 · 浅色（默认） |
| `deep-ocean` | 深海弧光 | 深海蓝青 · 深色 |
| `warm-coral` | 暖沙珊瑚 | 暖沙珊瑚 · 浅色 |
| `graphite-violet` | 墨紫流影 | 石墨紫罗兰 · 深色 |

> 4 张预设图均为本分支通过生成式工具原创制作的现代抽象渐变背景，不含人物、品牌、Logo 或第三方 IP；用户上传的自定义图片版权由用户自行负责。

## 设计边界

- 这是一个轻量工具。皮肤跟随当前 renderer 存活，豆包完整重载界面后重新运行一次 apply 即可
- CDP 只绑定本机回环地址 `127.0.0.1`，主题运行期间勿跑来路不明的本机程序
- 不修改官方安装目录与代码签名
- 深色主题通过豆包原生 `html[data-theme=dark]` 适配；点「原生界面」恢复时会切回换肤前的 `data-theme`
- 当前版本针对豆包的 `--dbx-*` / `--s-color-*` 设计变量系统和 `#chat-route-layout` / `#flow_chat_sidebar` 等稳定 DOM 锚点适配

## 技术原理

1. 根据参数、调用进程祖先、Skill 安装目录和运行实例识别当前客户端；识别结果固定传给独立后台 worker
2. 豆包使用本机端口 `9333` 并过滤 `doubao-chat`，豆包工作使用 `9334` 并过滤 `doubaowork-chat`
3. 用 CDP `Runtime.evaluate` 注入 CSS（`<style>`）+ 右上角菜单（DOM）
4. CSS override 豆包挂在 `html` 上的设计变量（`--s-color-bg-body` / `--chatarea-bg-color` / `--dbx-bg-body-mac` / `--color-text-primary` / `--s-color-brand-primary-default-raw` 等）实现全局换色
5. 给 `#root` 加背景图，`#chat-route-layout` / `#chat-route-main` / `main` / `#flow_chat_sidebar` 等容器设透明或磨砂让底图透出

## 许可与素材

代码使用 [MIT License](LICENSE)。4 张内置预设图均为本分支通过生成式工具原创制作的现代抽象渐变背景，不含人物、品牌、Logo 或第三方 IP。用户通过“自定义图片”上传的素材，版权由用户自行负责。
