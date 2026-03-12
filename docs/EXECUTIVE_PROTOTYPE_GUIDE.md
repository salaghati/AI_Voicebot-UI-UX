# AI Voicebot Ops Console

> Tài liệu đọc nhanh cho cấp quản lý và người xem prototype  
> Phiên bản: 1.0  
> Cập nhật: 11/03/2026

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
| `/bot-engine/outbound/new/step-*` và `/bot-engine/inbound/new/step-*` | Các route cũ của wizard theo bước | Hiện chỉ redirect về `/create`, không cần dùng như flow riêng |
| `/settings/agent/queue-new`, `/settings/users/new`, `/settings/roles/editor` | Màn hình cấu hình chi tiết | Chỉ mở khi cần đào sâu |

---

## 4. Cách các module liên kết với nhau

Phần này là `sơ đồ quan trọng nhất` để người đọc hiểu prototype đang vận hành ra sao.

Sơ đồ tổng thể cũ đã được lược bỏ vì:

- trùng ý với sơ đồ module ở bên dưới;
- không giúp người đọc phân biệt đâu là liên kết thật, đâu là liên kết một phần;
- dễ làm người xem hiểu nhầm rằng mọi khối trong hình đã được nối chặt với nhau ở mức code.

Vì vậy, tài liệu này dùng trực tiếp `bản đồ liên kết module theo code hiện tại` làm sơ đồ chính.

![Bản đồ liên kết module](./diagrams/executive-module-linkage.svg)

Cách đọc sơ đồ này:

- cột trái là `Settings`, tức các màn cấu hình nền;
- cột giữa là `core modules` đang được dùng trong flow chính;
- cột phải là nơi đọc kết quả vận hành;
- đường `xanh` là liên kết thật đang có trong code;
- đường `cam` là liên kết có một phần, nhưng chưa dùng source-of-truth chung;
- các box viền `cam nhạt` trong cột `Settings` là những phần có liên quan về mặt nghiệp vụ, nhưng chưa wire thật sang flow thao tác chính.

Kết luận ngắn từ sơ đồ:

- `KB Fallback -> Outbound/Inbound create` là liên kết thật;
- `Workflow -> Preview` là liên kết thật;
- `Workflow/KB -> Bot Engine` hiện mới ở mức tham chiếu qua mock refs;
- phần lớn `Settings` vẫn là màn cấu hình độc lập, chưa feed ngược vào `Workflow`, `Inbound`, `Preview` theo kiểu source-of-truth.

### 4.1. Bảng tóm tắt liên kết quan trọng

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

### 4.2. Cách các module thực sự nối với nhau trong hành trình người dùng

Người đọc sẽ dễ hiểu hơn nếu nhìn hệ thống theo `3 chuỗi thao tác chính` thay vì nhìn từng module rời nhau.

`Chuỗi 1: cấu hình một bot để chạy chiến dịch hoặc hotline`

1. Người vận hành vào `Bot Engine Create` để tạo `Outbound Campaign` hoặc `Inbound Route`.
2. Ở bước cấu hình, hệ thống yêu cầu gắn `Workflow`, `Knowledge Base`, và có thể gắn `KB Fallback`.
3. Trong code hiện tại:
   - `KB Fallback` là phần nối thật, vì màn create đọc danh sách rule active từ API;
   - `Workflow` và `Knowledge Base` mới nối một phần, vì danh sách chọn đang đến từ mock refs.
4. Kết quả là người xem vẫn hiểu đúng nghiệp vụ, nhưng về mặt kiến trúc code thì chưa phải một nguồn dữ liệu dùng chung hoàn toàn.

`Chuỗi 2: thiết kế logic xử lý của bot`

1. Người vận hành vào `Workflow` để tạo hoặc chỉnh sửa logic hội thoại.
2. Trong builder hiện tại, một workflow có thể gồm các node `Start`, `Prompt`, `Intent`, `Condition`, `API`, `KB`, `Handover`, `End`.
3. Về mặt ngữ nghĩa:
   - `Intent` là nơi thu nhu cầu của khách và có thể extract entity;
   - `Condition` là nơi đọc intent/entity để rẽ nhánh;
   - `API` là nơi dùng entity để gọi hệ thống ngoài;
   - `KB` là nơi bot tra tri thức từ KB đã được bind ở bước tạo outbound/inbound;
   - `Handover` là nơi chuyển sang người thật khi bot không nên xử lý tiếp.
4. `Preview` đọc workflow thật để mô phỏng transcript và runtime log.
5. Tuy nhiên:
   - node `API` chưa lấy danh sách API đã setup ở `Settings API`;
   - node `KB` chưa lấy trực tiếp danh sách tài liệu từ module `Knowledge Base`.

`Chuỗi 3: theo dõi kết quả sau khi cấu hình`

1. Sau khi campaign hoặc route đã được cấu hình, người quản lý đọc `Dashboard` và `Reports`.
2. Đây là lớp theo dõi hiệu quả vận hành: số lượng cuộc gọi, trạng thái, xu hướng, lỗi, chi tiết transcript.
3. Vì vậy, trong tài liệu này nên hiểu:
   - `Bot Engine`, `Workflow`, `KB`, `Settings` là lớp cấu hình và vận hành;
   - `Dashboard` và `Reports` là lớp đọc kết quả.

### 4.3. Điều người đọc cần nhớ để không hiểu nhầm prototype

- prototype đang mô tả rất tốt `ý nghĩa nghiệp vụ` và `trải nghiệm quản trị`;
- nhưng không phải mọi liên kết giữa module đều đã là `source-of-truth integration`;
- `Settings` hiện chủ yếu là các màn cấu hình độc lập;
- các liên kết mạnh nhất theo code hiện tại là:
  - `KB Fallback -> Bot Engine Create`;
  - `Workflow -> Preview`;
  - `Campaign / Inbound data -> Dashboard / Reports`.

Nói ngắn gọn:

> Nếu đọc tài liệu này để hiểu sản phẩm, hãy xem prototype như một hệ thống đã mô tả đúng luồng vận hành.  
> Nếu đọc để đánh giá mức độ tích hợp code hiện tại, hãy lưu ý rằng nhiều liên kết vẫn đang ở mức mock hoặc bán tích hợp.

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
| Workflow Node | Một bước trong workflow; trong bản deploy hiện tại có các loại `Start`, `Prompt`, `Intent`, `Condition`, `API`, `KB`, `Handover`, `End` |
| Intent | Nhu cầu hoặc mục đích mà khách đang muốn thực hiện |
| Entity | Dữ liệu cụ thể bot trích xuất từ lời khách để dùng cho điều kiện hoặc API |
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
- các route `/bot-engine/outbound/new/step-1..4` hiện chỉ redirect về `/bot-engine/outbound/create`.

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
- các route `/bot-engine/inbound/new/step-1..4` hiện chỉ redirect về `/bot-engine/inbound/create`.

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
- bấm từng node để xem đúng properties của node đang chọn;
- xem intent scope và entity scope của toàn workflow;
- xem version history;
- chạy preview để xem transcript và log.

`Bám theo code hiện tại:`

- list ở `/workflow`;
- builder ở `/workflow/new` và `/workflow/[id]/edit`;
- chi tiết ở `/workflow/[id]`;
- preview ở `/workflow/[id]/preview/session`, `/conversation`, `/api-log`, `/kb`;
- version history ở `/workflow/[id]/versions`.

`Cách hiểu đúng theo bản deploy:`

- `Workflow detail` hiện tách `thông tin chung` và `node properties`, tránh trộn metadata của workflow với cấu hình của node;
- workflow mẫu `WF_FullNode_Demo` được dùng để giải thích đầy đủ semantics của các loại node và quan hệ giữa `intent` với `entity`;
- `KB node` không phải nơi chọn lại KB, mà là bước bot đi tra tri thức từ KB đã bind ở outbound/inbound create.

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

`Độ bám code:` đây là sơ đồ giải thích logic nghiệp vụ/runtime, không phải một chuỗi page UI đầy đủ đang có trong app.

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

## 11. Cách dùng tài liệu này khi chuẩn bị trình bày

Mục này dành cho người nội bộ đang chuẩn bị demo hoặc giải thích prototype cho sếp. Mục tiêu không phải là đọc nguyên văn khi trình, mà là giúp người trình biết:

- nên mở màn hình nào trước;
- ở mỗi màn cần nói đúng ý gì;
- chỗ nào là màn hình thật trong code;
- chỗ nào là logic nghiệp vụ đang được mô phỏng.

### 11.1. Thứ tự demo nội bộ nên đi

| Bước | Route nên mở | Nên dùng màn này để nói gì |
| --- | --- | --- |
| 1 | `/dashboard` | Mở đầu bằng góc nhìn điều hành: hệ thống này dùng để quản trị vận hành voicebot, không phải chỉ là một chatbot demo |
| 2 | `/bot-engine/outbound` hoặc `/bot-engine/inbound` | Cho thấy platform quản lý đối tượng vận hành thật: campaign gọi ra hoặc route hotline gọi vào |
| 3 | `/bot-engine/outbound/create` hoặc `/bot-engine/inbound/create` | Giải thích cách một bot được cấu hình để chạy: gắn workflow, KB và KB fallback vào một ngữ cảnh vận hành cụ thể |
| 4 | `/workflow` | Chuyển sang phần “bộ não” của bot: nơi mô hình hóa cách bot chào, hiểu nhu cầu, tra dữ liệu, tra tri thức và handover |
| 5 | `/workflow/WF_FullNode_Demo` | Dùng workflow mẫu đầy đủ node để giải thích semantics chuẩn của `Start`, `Prompt`, `Intent`, `Condition`, `API`, `KB`, `Handover`, `End` |
| 6 | `/workflow/WF_FullNode_Demo/preview/session` | Cho xem mô phỏng transcript để người nghe thấy workflow không chỉ là sơ đồ mà còn dẫn tới hành vi runtime |
| 7 | `/kb/list` và `/kb/fallback` | Giải thích bot có hai lớp tri thức: kho nội dung để trả lời và fallback để thoát hiểm khi bot không chắc chắn |
| 8 | `/report/overview` | Chốt lại bằng việc doanh nghiệp đọc hiệu quả vận hành ở đâu sau khi bot chạy |
| 9 | `/settings/stt-tts` hoặc `/settings/api` | Kết luận rằng hệ thống không chỉ có flow business mà còn có lớp cấu hình nền để đi tới triển khai thực tế |

### 11.2. Cách giải thích ngắn ở từng điểm dừng

| Màn hình | Câu giải thích nội bộ nên nhớ |
| --- | --- |
| Dashboard | Đây là màn nhìn sức khỏe vận hành, không phải nơi cấu hình bot |
| Bot Engine Create | Đây là nơi tạo một đối tượng vận hành cụ thể; ở đây user bind `workflow`, `KB`, `KB fallback` vào campaign hoặc route |
| Workflow list | Đây là thư viện logic bot, mỗi workflow là một kịch bản xử lý có thể tái sử dụng |
| Workflow detail | Đây là nơi đọc logic của từng node; khi bấm vào node thì chỉ nên hiểu là đang xem properties của node đó |
| Workflow preview | Đây là runtime mô phỏng để giải thích bot sẽ nói gì, đi node nào, gọi API hay tra KB ra sao |
| KB list / fallback | Đây là nơi quản trị tri thức và cách xử lý khi bot không đủ tự tin |
| Report | Đây là lớp đo hiệu quả sau vận hành, không phải nơi định nghĩa logic bot |
| Settings | Đây là lớp cấu hình nền, không đồng nghĩa mọi cấu hình trong settings đã được wire 100% vào mọi module |

### 11.3. Ba điểm rất dễ nói lệch khi trình

1. `Workflow` quyết định logic, còn `Outbound/Inbound` quyết định ngữ cảnh vận hành.
2. `KB` được chọn ở bước tạo `Outbound/Inbound`; `KB node` trong workflow chỉ là bước bot đi tra tri thức, không phải nơi chọn lại KB.
3. `Intent` là nhu cầu của khách, còn `Entity` là dữ liệu bot lấy được để dùng cho `Condition` hoặc `API`.

### 11.4. Workflow nào nên dùng để giải thích cho dễ hiểu

Nếu chỉ chọn một workflow để giải thích nội bộ trước khi trình cho sếp, nên ưu tiên:

- `WF_FullNode_Demo`: dễ dùng nhất để giải thích ngữ nghĩa đầy đủ của các loại node;
- `WF_Mau_HoanChinh`: phù hợp nếu muốn minh họa gần hơn với một flow nghiệp vụ đầy đủ;
- `WF_ThuNo_A`: phù hợp nếu muốn nói về use case nhắc thanh toán/outbound rõ ràng.

---

## 12. Cách hiểu đúng các màn hình trong bản deploy hiện tại

Mục này dùng để tự kiểm tra khi thao tác trên prototype. Nếu thấy một màn “không giống production thật”, cần xác định nó thuộc một trong ba lớp sau:

- `màn hình thật trong code`: có route và có thể thao tác trực tiếp;
- `màn hình mô phỏng`: dùng mock data hoặc runtime giả lập để giải thích sản phẩm;
- `diễn giải nghiệp vụ`: nằm trong tài liệu để giúp người đọc hiểu logic tổng thể, không phải click-flow 1:1.

### 12.1. Đọc từng nhóm màn hình như thế nào

| Nhóm màn hình | Nên hiểu đúng theo bản deploy hiện tại |
| --- | --- |
| Dashboard | Nơi đọc chỉ số vận hành tổng thể; không phải nơi tạo hay sửa dữ liệu |
| Outbound / Inbound list | Nơi xem đối tượng vận hành đang được quản lý; mỗi item là một campaign hoặc route đã gắn workflow/KB/fallback |
| Outbound / Inbound create | Nơi bind các thành phần lại với nhau để bot có thể chạy trong ngữ cảnh business cụ thể |
| Workflow list | Nơi xem thư viện workflow và chọn workflow để đọc, sửa, preview hoặc xem version |
| Workflow detail | Nơi đọc logic của workflow; phần sidebar phải được hiểu là properties của node đang chọn, không phải summary của toàn workflow |
| Workflow preview | Nơi mô phỏng runtime: transcript, log node, API log, KB log |
| KB list / KB detail | Nơi quản trị tài liệu tri thức, trạng thái học và thông tin sử dụng |
| KB fallback | Nơi định nghĩa cách hệ thống phản ứng khi bot không hiểu hoặc KB match kém |
| Reports | Nơi đọc hiệu quả sau vận hành; dữ liệu hiện vẫn là dữ liệu mô phỏng |
| Settings | Nơi cấu hình nền của platform; một số phần đã có màn hình riêng nhưng chưa phải mọi mục đều được tích hợp hoàn toàn vào runtime |

### 12.2. Cách đọc đúng phần workflow để không bị mơ hồ

| Thành phần trong workflow | Nên hiểu thế nào |
| --- | --- |
| `Start` | Điểm bắt đầu của flow |
| `Prompt` | Bước bot nói ra một lời thoại hoặc hướng dẫn |
| `Intent` | Bước bot thu nhu cầu của khách và có thể extract intent/entity |
| `Condition` | Bước rẽ nhánh dựa trên intent hoặc entity đã có |
| `API` | Bước gọi hệ thống ngoài bằng dữ liệu đã thu được |
| `KB` | Bước tra tri thức từ KB đã bind ở outbound/inbound create |
| `Handover` | Bước chuyển sang người thật hoặc queue hỗ trợ |
| `End` | Điểm kết thúc flow |

### 12.3. Cách hiểu đúng quan hệ giữa intent và entity

| Khái niệm | Ý nghĩa trong workflow |
| --- | --- |
| Intent | Khách đang muốn làm gì, ví dụ kiểm tra thanh toán, hỏi chính sách, yêu cầu gặp agent |
| Entity | Dữ liệu cụ thể bot lấy ra từ câu nói của khách, ví dụ `customer_id`, `bill_code`, `phone_number` |
| Intent node | Nơi phù hợp nhất để thu intent và entity |
| Condition node | Đọc intent/entity để quyết định đi nhánh nào |
| API node | Dùng entity làm tham số đầu vào để gọi hệ thống ngoài |
| KB node | Thường dùng câu hỏi/ngữ cảnh hiện tại để tra tri thức; không phải nơi khai báo lại business context |

### 12.4. Màn nào bám UI thật, màn nào thiên về giải thích

| Loại nội dung | Nên hiểu thế nào |
| --- | --- |
| Route cụ thể như `/workflow/[id]`, `/workflow/[id]/preview/session`, `/bot-engine/outbound/create` | Đây là màn hình có thật trong code hiện tại |
| Route `/bot-engine/*/new/step-1..4` | Trong code hiện tại chúng chỉ redirect về màn `/create`, không nên xem là một flow riêng |
| Bảng mô tả module | Đây là lớp giải thích cho người đọc, không phải UI specification |
| Activity diagram gắn với create/list/detail | Đây là flow tương đối sát với các màn hình thật |
| Activity diagram gắn với runtime, handover, improvement loop | Đây là flow nghiệp vụ để giải thích sản phẩm, không phải chuỗi click 1:1 |

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
