# AI Voicebot Ops Console

> Tài liệu đọc nhanh cho cấp quản lý và người xem prototype  
> Phiên bản: 1.0  
> Cập nhật: 10/03/2026

---

## 1. Mục đích tài liệu

Tài liệu này giúp người đọc:

- hiểu prototype đang mô phỏng sản phẩm gì;
- hiểu từng module có ý nghĩa nghiệp vụ gì;
- biết bấm vào đâu để xem luồng chính;
- biết đâu là tính năng thật trong prototype và đâu là dữ liệu mock;
- có thể xem demo cùng prototype mà không cần đội kỹ thuật giải thích từng màn hình.

Tài liệu này được viết theo góc nhìn quản lý vận hành và quản lý sản phẩm, không đi sâu vào code.

---

## 2. Tóm tắt điều hành

`AI Voicebot Ops Console` là giao diện quản trị cho một nền tảng tổng đài AI có hai năng lực chính:

1. `Outbound`: bot chủ động gọi ra cho khách hàng để nhắc thanh toán, khảo sát, bán chéo, chăm sóc sau bán.
2. `Inbound`: bot tiếp nhận cuộc gọi vào hotline, hiểu nhu cầu, trả lời theo kịch bản và chuyển agent khi cần.

Prototype này mô phỏng đầy đủ bức tranh vận hành:

- tạo và quản lý campaign gọi ra;
- tạo và quản lý route cuộc gọi vào;
- thiết kế workflow hội thoại;
- quản lý Knowledge Base và fallback;
- xem dashboard, báo cáo và log cuộc gọi;
- cấu hình các tham số hệ thống như STT/TTS, API, agent handover, phân quyền.

Điểm cần hiểu đúng:

- đây là `prototype tương tác`, không phải backend production;
- dữ liệu hiện tại được lấy từ `mock API` trong ứng dụng;
- người xem vẫn có thể thao tác gần như thật: tạo mới, chuyển bước, filter, xem chi tiết, preview, bật tắt trạng thái, xem log;
- mục tiêu của prototype là chứng minh `luồng sản phẩm`, `trải nghiệm quản trị`, và `cách vận hành end-to-end`.

Để bám sát code hiện tại, cần hiểu thêm:

- các màn hình thao tác chính đang nằm ở `Dashboard`, `Bot Engine`, `Workflow`, `KB`, `Report`, `Settings`, `Preview`;
- các màn hình tạo mới chính trong code là `/bot-engine/outbound/create`, `/bot-engine/inbound/create`, `/workflow/new`, `/kb/add`;
- `/settings` trong app hiện redirect về `/settings/stt-tts`;
- một số route phụ như `preview/platform-review/*` tồn tại để thử pattern UX, nhưng không phải luồng chính của executive demo.

---

## 3. Prototype đang bao phủ những gì

### 3.1. Có trong prototype

| Nhóm chức năng | Ý nghĩa |
| --- | --- |
| Login | Điểm vào hệ thống quản trị |
| Dashboard | Theo dõi tình hình vận hành bot theo thời gian thực |
| Bot Engine Outbound | Quản lý chiến dịch gọi ra |
| Bot Engine Inbound | Quản lý hotline và route cuộc gọi vào |
| Workflow | Thiết kế logic xử lý hội thoại |
| Knowledge Base | Quản lý tri thức để bot tra cứu |
| KB Fallback | Xử lý khi bot không hiểu hoặc không tìm thấy tri thức phù hợp |
| Report | Tổng hợp hiệu quả, chi tiết cuộc gọi, lỗi, hiệu suất agent |
| Preview / Playground | Mô phỏng runtime, transcript và log kỹ thuật |
| Settings | Quản trị cấu hình hệ thống |

### 3.2. Không nằm trong phạm vi prototype

| Hạng mục | Trạng thái |
| --- | --- |
| Kết nối PBX / tổng đài thật | Chưa kết nối |
| STT / TTS / LLM thật | Chỉ mô phỏng |
| CRM / CDP / ticketing thật | Chỉ mô phỏng |
| Tài khoản thật và phân quyền thật | Chỉ mô phỏng |
| Research app ở slide 61-101 | Không nằm trong repo này |

### 3.3. Có trong code nhưng không phải luồng trình bày chính

| Nhóm route | Vai trò trong repo | Có nên đưa vào demo executive không |
| --- | --- | --- |
| `/preview/platform-review/*` | Thử nghiệm pattern UX thay thế | Không cần, trừ khi đang so sánh thiết kế |
| `/bot-engine/campaigns/*` | Nhánh phụ trong prototype | Không cần nếu mục tiêu là hiểu sản phẩm chính |
| `/bot-engine/outbound/new/step-*` và `/bot-engine/inbound/new/step-*` | Các màn wizard theo bước riêng | Không ưu tiên, vì route `/create` hiện dễ demo hơn |
| `/settings/agent/queue-new`, `/settings/users/new`, `/settings/roles/editor` | Màn hình cấu hình chi tiết | Chỉ mở khi cần đào sâu |

---

## 4. Cách nhìn sản phẩm trong 1 sơ đồ

![Sơ đồ tổng thể nền tảng](./diagrams/executive-system-overview.svg)

Ý nghĩa của sơ đồ:

- `Bot Engine` là nơi tạo và vận hành luồng gọi.
- `Workflow` quyết định bot sẽ nói gì, hỏi gì, gọi API nào, chuyển nhánh ra sao.
- `Knowledge Base` cung cấp tri thức để bot trả lời.
- `Settings` giữ các cấu hình nền như STT/TTS, API, đầu số, agent, fallback.
- `Report` và `Dashboard` giúp người quản lý theo dõi hiệu quả và rủi ro vận hành.

## 4.1. Bản đồ liên kết module theo code hiện tại

![Bản đồ liên kết module](./diagrams/executive-module-linkage.svg)

Cách đọc sơ đồ này:

- cột trái là `Settings`, tức các màn cấu hình nền;
- cột giữa là `core modules` đang được dùng trong flow chính;
- cột phải là nơi đọc kết quả vận hành;
- đường `xanh` là liên kết thật đang có trong code;
- đường `cam` là liên kết có một phần, nhưng chưa dùng source-of-truth chung;
- đường `đỏ` là có liên quan về mặt nghiệp vụ nhưng chưa wire thật.

Kết luận ngắn từ sơ đồ:

- `KB Fallback -> Outbound/Inbound create` là liên kết thật;
- `Workflow -> Preview` là liên kết thật;
- `Workflow/KB -> Bot Engine` hiện mới ở mức tham chiếu qua mock refs;
- phần lớn `Settings` vẫn là màn cấu hình độc lập, chưa feed ngược vào `Workflow`, `Inbound`, `Preview` theo kiểu source-of-truth.

### 4.2. Bảng tóm tắt liên kết quan trọng

| Liên kết | Trạng thái theo code hiện tại | Ghi chú ngắn |
| --- | --- | --- |
| `Settings API -> Workflow API node` | Chưa link chuẩn | Workflow đang nhập tay `apiRef`, `apiUrl`, `authProfile` |
| `Settings Agent -> Inbound queue / transfer target` | Chưa link chuẩn | Queue/group chưa dùng chung giữa settings và flow tạo route |
| `Settings STT/TTS -> Preview / runtime` | Chưa link chuẩn | Có settings page nhưng preview chưa đọc trực tiếp |
| `Settings Extensions / Phone Numbers -> Inbound` | Chưa link chuẩn | Inbound create vẫn nhập hoặc chọn giá trị riêng |
| `KB Fallback -> Outbound create` | Có link thật | Chọn rule active qua API |
| `KB Fallback -> Inbound create` | Có link thật | Chọn rule active qua API |
| `Workflow -> Preview` | Có link thật | Preview đọc workflow thật |
| `Workflow -> Bot Engine create` | Link một phần | Chọn qua `workflowRefs` mock |
| `Knowledge Base -> Bot Engine create` | Link một phần | Chọn qua `knowledgeRefs` mock |
| `Campaign / Inbound data -> Dashboard / Reports` | Có link thật | Đã có consumer hiển thị kết quả vận hành |

---

## 5. Nhóm actor dùng trong tài liệu này

Để người đọc dễ theo dõi, phần use case của tài liệu được rút gọn về `2 actor chính`:

| Actor | Đại diện cho ai | Họ làm gì trong bức tranh tổng thể |
| --- | --- | --- |
| Admin | Toàn bộ nhóm thao tác trong console: vận hành, cấu hình, thiết kế workflow, quản trị tri thức | Tạo cấu hình, tổ chức logic bot, theo dõi báo cáo, quản lý hệ thống |
| Agent | Nhân viên nhận handover từ bot hoặc tham gia xử lý sau cuộc gọi | Tiếp nhận cuộc gọi cần người thật xử lý và khai thác thông tin liên quan |

Lý do gom như vậy:

- người đọc cấp quản lý thường chỉ cần phân biệt `người quản trị hệ thống` và `người xử lý cuộc gọi thật`;
- các vai trò như Campaign Manager, Ops Manager, Bot Designer, Knowledge Supervisor trong prototype đều có thể xem là các biến thể của `Admin` ở mức use case tổng quan;
- như vậy sơ đồ ngắn gọn hơn và bám đúng yêu cầu trình bày ở mức điều hành.

Lưu ý để bám đúng code:

- trong prototype hiện tại `Admin` là nhóm người dùng thao tác trên UI;
- `Agent` là actor nghiệp vụ ở ngoài luồng UI, không có một portal riêng trong code hiện tại;
- vì vậy khi tài liệu nói tới `Agent`, đó là để giải thích ý nghĩa nghiệp vụ của handover, không phải để mô tả một màn hình đang có trong app.

---

## 6. Bản đồ use case

![Bản đồ use case](./diagrams/usecase-admin-agent-v2.svg)

Sơ đồ này trả lời câu hỏi:

- trong bối cảnh quản trị, `Admin` thao tác những nhóm việc nào;
- `Agent` liên quan đến phần nào của hệ thống;
- các thao tác nào là lõi của prototype này.

Điểm quan trọng:

- `Admin` là actor chính của console;
- `Agent` chỉ tham gia ở những điểm giao với cuộc gọi thực tế hoặc dữ liệu hậu kiểm;
- `Outbound`, `Inbound`, `Workflow`, `KB`, `Report`, `Settings` vẫn là các khối chức năng trung tâm;
- sơ đồ use case này không nhằm mô tả toàn bộ backend, mà mô tả mục đích sử dụng của prototype.

---

## 7. Bản đồ điều hướng của prototype

![Bản đồ điều hướng prototype](./diagrams/executive-navigation-map.svg)

Nếu cần demo nhanh, chỉ cần đi theo chuỗi:

`Login -> Dashboard -> Outbound -> Workflow -> KB -> Report -> Settings -> Preview`

Chuỗi này đủ để người xem hiểu gần như toàn bộ hệ thống.

### 7.1. Bản đồ màn hình chính theo route thật trong code

| Nhóm | Route chính | Màn hình / ý nghĩa trong prototype |
| --- | --- | --- |
| Auth | `/auth/login`, `/auth/forgot-password` | Đăng nhập và quên mật khẩu |
| Dashboard | `/dashboard` | Bảng điều hành tổng quan |
| Outbound | `/bot-engine/outbound`, `/bot-engine/outbound/create`, `/bot-engine/outbound/[id]` | Danh sách, tạo mới, xem chi tiết campaign |
| Inbound | `/bot-engine/inbound`, `/bot-engine/inbound/create`, `/bot-engine/inbound/[id]` | Danh sách, tạo mới, xem chi tiết route |
| Workflow | `/workflow`, `/workflow/new`, `/workflow/[id]`, `/workflow/[id]/edit`, `/workflow/[id]/versions`, `/workflow/[id]/preview/*` | Danh sách, builder, chi tiết, version, preview |
| KB | `/kb/list`, `/kb/add`, `/kb/list/[id]`, `/kb/fallback`, `/kb/usage` | Danh sách KB, thêm mới, chi tiết, fallback, usage |
| Report | `/report/overview`, `/report/inbound`, `/report/outbound`, `/report/call-detail/[id]`, `/report/error-monitor`, `/report/agent-analysis` | Tổng quan, chi tiết, lỗi, agent |
| Settings | `/settings/stt-tts`, `/settings/users`, `/settings/api`, `/settings/agent`, `/settings/fallback`, `/settings/phone-numbers`, `/settings/extensions`, `/settings/roles` | Các màn cấu hình hệ thống |
| Preview | `/preview/playground` | Transcript mô phỏng và technical log |

### 7.2. Quy tắc đọc tài liệu này cho đúng với prototype

- nếu nội dung có route cụ thể, đó là phần đang có màn hình thật trong code;
- nếu nội dung nói về `runtime`, `handover`, `vòng lặp cải tiến`, đó là lớp giải thích sản phẩm ở mức nghiệp vụ;
- nếu cần demo bám chặt prototype, ưu tiên bám theo bảng route ở trên thay vì chỉ nhìn sơ đồ khái niệm.

---

## 8. Các khái niệm cốt lõi cần hiểu

| Khái niệm | Giải thích ngắn |
| --- | --- |
| Campaign | Một chiến dịch gọi ra theo một mục tiêu cụ thể, ví dụ nhắc thanh toán hoặc khảo sát |
| Inbound Route | Một tuyến hotline đi vào hệ thống, gắn với queue, extension và workflow xử lý |
| Workflow | Kịch bản logic quyết định bot nghe gì, hiểu gì, gọi API nào, tra KB nào, và kết thúc ra sao |
| Workflow Node | Một bước trong workflow; có thể là `Intent`, `Condition`, `API`, `KB` |
| Knowledge Base | Nguồn tri thức để bot tra cứu và trả lời |
| KB Fallback | Quy tắc phản ứng khi bot không hiểu hoặc match KB thấp |
| Handover | Chuyển bot sang nhân viên thật |
| Report | Kết quả vận hành sau cuộc gọi hoặc chiến dịch |

---

## 9. Ý nghĩa từng module

### 9.1. Dashboard

`Mục đích:` cho người vận hành biết hệ thống đang khỏe hay không.

`Người dùng chính:` Ops Manager, Tổng đài trưởng.

`Xem gì ở đây:`

- số cuộc gọi tổng, thành công, thất bại;
- xu hướng inbound và outbound;
- top intent được nhận diện;
- lý do handover sang agent;
- sức khỏe API và độ chính xác STT.

`Thông điệp cho sếp:` đây là màn hình điều hành, dùng để nhìn ngay tình trạng vận hành bot ở mức tổng quan.

### 9.2. Bot Engine Outbound

`Mục đích:` tạo và quản lý chiến dịch gọi ra.

`Người dùng chính:` Campaign Manager, Sales Ops, Collections Ops.

`Thao tác chính:`

- xem danh sách campaign;
- mở chi tiết campaign;
- tạo campaign mới theo từng bước;
- chọn nguồn dữ liệu;
- gắn workflow;
- gắn Knowledge Base;
- gắn KB Fallback đang active;
- cấu hình lịch gọi và retry.

`Bám theo code hiện tại:`

- danh sách ở `/bot-engine/outbound`;
- màn tạo mới dễ demo nhất ở `/bot-engine/outbound/create`;
- ngoài ra repo vẫn có các route `/bot-engine/outbound/new/step-1..4`, nhưng không cần dùng làm luồng chính của tài liệu này.

`Ý nghĩa nghiệp vụ:` giúp doanh nghiệp mở rộng gọi ra tự động mà không phụ thuộc hoàn toàn vào nhân sự gọi thủ công.

### 9.3. Bot Engine Inbound

`Mục đích:` cấu hình cách hệ thống tiếp nhận cuộc gọi vào.

`Người dùng chính:` Ops Manager, Call Center Supervisor.

`Thao tác chính:`

- xem danh sách route inbound;
- tạo route mới;
- cấu hình queue và extension;
- gắn workflow xử lý;
- gắn KB và fallback;
- kiểm tra chi tiết route.

`Bám theo code hiện tại:`

- danh sách ở `/bot-engine/inbound`;
- màn tạo mới dễ demo nhất ở `/bot-engine/inbound/create`;
- repo cũng có các route `/bot-engine/inbound/new/step-1..4`, nhưng tài liệu này không lấy chúng làm trung tâm.

`Ý nghĩa nghiệp vụ:` mỗi hotline hoặc đầu số có thể được định nghĩa cách xử lý riêng mà không phải sửa hệ thống lõi.

### 9.4. Workflow

`Mục đích:` là nơi mô hình hóa “bộ não xử lý” của bot.

`Người dùng chính:` Bot Designer, Product Owner, Solution Architect.

`Thao tác chính:`

- xem danh sách workflow;
- bật hoặc tắt trạng thái workflow;
- tạo workflow mới;
- chỉnh sửa node;
- xem sơ đồ diagram;
- xem version history;
- chạy preview để xem transcript và log.

`Bám theo code hiện tại:`

- list ở `/workflow`;
- builder ở `/workflow/new` và `/workflow/[id]/edit`;
- chi tiết ở `/workflow/[id]`;
- preview ở `/workflow/[id]/preview/session`, `/conversation`, `/api-log`, `/kb`;
- version history ở `/workflow/[id]/versions`.

`Ý nghĩa nghiệp vụ:` đây là nơi chuyển yêu cầu nghiệp vụ thành logic bot có thể thực thi.

### 9.5. Knowledge Base

`Mục đích:` quản lý nội dung tri thức cho bot.

`Người dùng chính:` Knowledge Supervisor, Product Content Owner.

`Thao tác chính:`

- tạo KB từ URL, bài viết hoặc file;
- xem chi tiết từng tài liệu;
- chuyển trạng thái học của KB;
- xóa tài liệu;
- xem KB nào đang được workflow hoặc hội thoại sử dụng;
- cấu hình fallback khi KB không đủ tốt.

`Bám theo code hiện tại:`

- danh sách ở `/kb/list`;
- thêm mới ở `/kb/add`;
- chi tiết tài liệu ở `/kb/list/[id]`;
- fallback ở `/kb/fallback`;
- usage ở `/kb/usage`.

`Ý nghĩa nghiệp vụ:` giảm việc hard-code câu trả lời trong workflow, cho phép bot trả lời linh hoạt theo kho tri thức được cập nhật.

### 9.6. Report

`Mục đích:` đo hiệu quả và kiểm tra chất lượng vận hành.

`Người dùng chính:` Ops Manager, QA, Business Owner.

`Các nhánh chính:`

- `Overview`: bức tranh tổng thể;
- `Inbound`: hiệu quả cuộc gọi vào;
- `Outbound`: hiệu quả chiến dịch gọi ra;
- `Call Detail`: transcript, intent, entity;
- `Error Monitor`: lỗi theo thời gian;
- `Agent Analysis`: hiệu suất nhân viên sau handover.

`Ý nghĩa nghiệp vụ:` trả lời câu hỏi “bot đang mang lại hiệu quả gì” và “điểm nghẽn đang nằm ở đâu”.

### 9.7. Settings

`Mục đích:` cấu hình nền tảng và các tham số vận hành.

`Người dùng chính:` Admin, Tech Ops, Solution Owner.

`Các nhóm cấu hình:`

- STT / TTS / VAD;
- người dùng;
- API integration;
- agent handover;
- fallback hệ thống;
- đầu số;
- extension;
- phân quyền.

`Ý nghĩa nghiệp vụ:` gom toàn bộ cấu hình nền về một nơi để đội vận hành không phải chỉnh sửa kỹ thuật thủ công.

`Bám theo code hiện tại:`

- trang gốc `/settings` chỉ redirect;
- các trang cấu hình thật nằm ở các route con như `/settings/stt-tts`, `/settings/users`, `/settings/api`, `/settings/agent`, `/settings/fallback`, `/settings/phone-numbers`, `/settings/extensions`, `/settings/roles`.

### 9.8. Preview / Playground

`Mục đích:` mô phỏng cuộc hội thoại và quan sát log runtime.

`Người dùng chính:` Bot Designer, QA, Presales, Product.

`Thao tác chính:`

- play transcript hội thoại;
- xem log node;
- xem latency STT / LLM / TTS;
- dùng làm màn hình “trình diễn” với stakeholder.

`Ý nghĩa nghiệp vụ:` giúp giải thích bot hoạt động như thế nào mà không cần tích hợp thật vào tổng đài.

`Bám theo code hiện tại:`

- route chính là `/preview/playground`;
- ngoài ra repo có thêm `preview/platform-review/*` nhưng đó là nhánh review UX, không phải luồng chuẩn mà tài liệu này đang mô tả.

---

## 10. Activity diagram theo từng quy trình

Lưu ý quan trọng:

- mục này gồm cả `screen flow` và `conceptual flow`;
- `10.1`, `10.3`, `10.4` bám khá sát các màn hình thật trong prototype;
- `10.2` và `10.5` mang tính giải thích sản phẩm và runtime nhiều hơn, không phải chuỗi click từng page trong app.

### 10.1. Tạo và cấu hình một campaign outbound

![Activity diagram tạo campaign outbound](./diagrams/activity-outbound-campaign-v2.svg)

Cách đọc sơ đồ:

- các lane được chia theo vai trò tham gia vào quy trình;
- mũi tên thể hiện thứ tự thực hiện;
- hình thoi thể hiện điểm quyết định;
- điểm bắt đầu và kết thúc giúp người đọc nhìn được vòng đời đầy đủ của thao tác.

Ý nghĩa nghiệp vụ:

- campaign không tự chứa tất cả logic;
- campaign chỉ tham chiếu đến workflow, KB và fallback;
- doanh nghiệp có thể nhân bản cách làm giữa nhiều chiến dịch nhưng vẫn kiểm soát tập trung logic.

### 10.2. Khách hàng gọi vào và hệ thống xử lý inbound

![Activity diagram xử lý inbound](./diagrams/activity-inbound-runtime-v2.svg)

Cách đọc sơ đồ:

- lane khách hàng cho thấy trải nghiệm bên ngoài;
- lane platform cho thấy bot phải đi qua các bước hiểu ý định, lấy dữ liệu, tra tri thức và quyết định handover;
- lane agent chỉ xuất hiện khi bot không nên hoặc không thể xử lý tiếp.

Ý nghĩa nghiệp vụ:

- hotline không chỉ là trả lời tự động;
- hệ thống đang mô phỏng một chuỗi xử lý có điều kiện, có tri thức, có dữ liệu, và có cơ chế chuyển người thật khi cần;
- đây là điểm khác biệt giữa voicebot vận hành được và IVR đơn giản.

`Độ bám code:` đây là sơ đồ giải thích logic nghiệp vụ/runtme, không phải một chuỗi page UI đầy đủ đang có trong app.

### 10.3. Thiết kế, preview và publish workflow

![Activity diagram vòng đời workflow](./diagrams/activity-workflow-lifecycle-v2.svg)

Ý nghĩa nghiệp vụ:

- workflow là nơi chuyển yêu cầu nghiệp vụ thành logic cụ thể;
- preview và versioning giúp giảm rủi ro khi chỉnh sửa;
- đội nghiệp vụ có thể review logic trước khi mang vào campaign hoặc route thật.

`Độ bám code:` cao, vì prototype đang có list, builder, detail, version history và các tab preview tương ứng.

### 10.4. Cập nhật tri thức và fallback

![Activity diagram quản trị tri thức](./diagrams/activity-kb-governance-v2.svg)

Ý nghĩa nghiệp vụ:

- bot không thể tốt hơn nếu tri thức không được quản trị;
- KB và fallback là hai lớp đi cùng nhau: một lớp để trả lời đúng, một lớp để thoát hiểm khi không đủ chắc chắn;
- phần này giải thích vì sao prototype có riêng module `KB`, `KB Usage` và `KB Fallback`.

`Độ bám code:` cao ở mức UI quản trị KB; phần “đi vào runtime” vẫn là diễn giải sản phẩm, không phải luồng click màn hình đơn thuần.

### 10.5. Theo dõi báo cáo và vòng lặp cải tiến

![Activity diagram giám sát và cải tiến](./diagrams/activity-reporting-loop-v2.svg)

Ý nghĩa nghiệp vụ:

- report không chỉ để xem số liệu;
- report là đầu vào để quyết định sửa workflow, đổi tri thức, tối ưu campaign hoặc chỉnh cấu hình hệ thống;
- đây là vòng lặp cải tiến liên tục của một hệ thống voicebot thực thụ.

`Độ bám code:` trung bình; phần dashboard/report là màn hình thật, nhưng phần “giao việc tối ưu và theo dõi sau thay đổi” là diễn giải operating model.

---

## 11. Cách thao tác khi trình diễn cho sếp

### 11.1. Kịch bản demo 10-15 phút

| Bước | Route gợi ý | Mục tiêu trình bày |
| --- | --- | --- |
| 1 | `/auth/login` | Cho thấy đây là một console quản trị hoàn chỉnh |
| 2 | `/dashboard` | Mở bằng bức tranh vận hành tổng thể |
| 3 | `/bot-engine/outbound` | Chỉ ra doanh nghiệp có thể quản lý các chiến dịch gọi ra |
| 4 | `/bot-engine/outbound/create` | Cho thấy việc tạo campaign là có cấu trúc, không phải nhập tay rời rạc |
| 5 | `/workflow` | Giải thích workflow là “bộ não” của bot |
| 6 | `/workflow/WF_ThuNo_A` | Mở một workflow chi tiết để xem node và logic |
| 7 | `/workflow/WF_ThuNo_A/preview/session` | Cho xem bot chạy thử, có transcript và log |
| 8 | `/kb/list` | Chỉ ra bot có kho tri thức riêng |
| 9 | `/kb/fallback` | Giải thích khi bot không hiểu thì xử lý thế nào |
| 10 | `/report/overview` | Chốt lại bằng dữ liệu đo hiệu quả |
| 11 | `/settings/stt-tts` | Kết luận rằng hệ thống có đủ màn hình quản trị nền |

### 11.2. Mẫu lời dẫn ngắn khi demo

1. `Dashboard` cho thấy hệ thống đang chạy ra sao.
2. `Bot Engine` cho thấy chúng ta cấu hình chiến dịch và hotline như thế nào.
3. `Workflow` cho thấy bot “nghĩ” và “ra quyết định” theo logic nào.
4. `Knowledge Base` cho thấy bot dựa vào tri thức nào để trả lời.
5. `Report` cho thấy sau khi chạy thì doanh nghiệp đo hiệu quả bằng gì.
6. `Settings` cho thấy hệ thống đủ khả năng đi tới triển khai thực tế.

---

## 12. Cách hiểu các màn hình khi thao tác

| Màn hình | Người xem nên chú ý điều gì |
| --- | --- |
| Dashboard | Chỉ số và đồ thị, không phải nơi tạo dữ liệu |
| Outbound / Inbound list | Danh sách đối tượng đang được quản lý |
| Create flows | Luồng tạo mới theo từng bước có kiểm tra dữ liệu |
| Workflow detail | Sơ đồ logic thực thi của bot |
| Workflow preview | Runtime mô phỏng, transcript và log kỹ thuật |
| KB list | Tài liệu tri thức và trạng thái học |
| KB fallback | Phương án xử lý khi bot không tự giải quyết được |
| Reports | Kết quả và chất lượng sau vận hành |
| Settings | Cấu hình nền, không phải dữ liệu business trực tiếp |

### 12.1. Màn nào là “chuẩn màn”, màn nào là “chuẩn ý nghĩa”

| Loại nội dung | Nên hiểu thế nào |
| --- | --- |
| Route cụ thể như `/workflow/[id]/preview/session` | Đây là màn hình có thật trong code |
| Bảng mô tả module | Đây là cách giải thích ý nghĩa của nhóm màn hình |
| Activity diagram gắn với create/list/detail | Đây là flow gần với UI thật |
| Activity diagram gắn với runtime, handover, improvement loop | Đây là flow nghiệp vụ, không phải màn hình 1:1 |

---

## 13. Giới hạn hiện tại của prototype

Để tránh hiểu sai khi trình bày, cần nói rõ:

- các thao tác lưu, tạo mới, xóa, bật tắt hiện dùng `mock API`;
- prototype ưu tiên chứng minh `flow`, `màn hình`, `nghiệp vụ`, chưa chứng minh `throughput` hay `độ ổn định production`;
- một số màn có tính chất phase 2 hoặc preview UX;
- dữ liệu trong report và dashboard là dữ liệu mô phỏng;
- chưa có tích hợp thật với tổng đài, CRM, ticketing, STT/TTS provider.
- actor `Agent` trong tài liệu là actor nghiệp vụ bên ngoài, không đồng nghĩa với một màn hình riêng trong app.

Nói cách khác:

> Prototype này dùng để chốt cách sản phẩm hoạt động và cách người dùng vận hành nó, chưa phải bản production deployment.

---

## 14. Kết luận cho người đọc

Nếu chỉ nhớ 4 ý, hãy nhớ:

1. Đây là `console vận hành` cho một nền tảng AI Voicebot end-to-end.
2. `Workflow` là lõi logic, `Knowledge Base` là lõi tri thức, `Report` là lõi đo hiệu quả.
3. `Outbound` và `Inbound` là hai bài toán kinh doanh chính mà hệ thống phục vụ.
4. Prototype đã đủ để đánh giá mức độ đầy đủ của sản phẩm, trải nghiệm quản trị và logic demo với khách hàng hoặc nội bộ.

---

## 15. Tài liệu liên quan

- [README](../README.md)
- [Business Documentation](../BUSINESS_DOCUMENTATION.md)
- [Full Documentation](../FULL_DOCUMENTATION.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Acceptance Checklist](./acceptance-checklist.md)
