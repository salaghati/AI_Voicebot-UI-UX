# Agent Handover System Spec

> Tài liệu chuẩn hóa nghiệp vụ `Agent / Handover` cho toàn bộ AI Voicebot Portal  
> Trạng thái: Draft for alignment  
> Cập nhật: 13/03/2026

---

## 1. Mục tiêu của spec

Spec này chốt lại `Agent / Handover` là gì, nó tác động lên những module nào, và phải vận hành thống nhất ra sao trong toàn hệ thống.

Mục tiêu là tránh các tình trạng:

- `Inbound Route`, `Settings Agent`, `Workflow Handover node` cùng nói về handover nhưng không cùng một nghĩa;
- queue trong inbound khác nghĩa với queue trong handover;
- outbound không có chỗ cấu hình handover nhưng runtime vẫn cần chuyển agent;
- workflow phải nhập tay queue/agent target nên không tái sử dụng được giữa nhiều campaign hoặc route.

---

## 2. Kết luận thiết kế

`Agent Handover` là một `năng lực nền tảng cấp hệ thống`, không phải chỉ là một field trong workflow.

Nó phải được hiểu theo mô hình:

1. `Settings Agent`
   - định nghĩa `handover resources` và `handover profiles`
2. `Bot Engine`
   - chọn `default handover profile` cho từng outbound campaign hoặc inbound route
3. `Workflow`
   - quyết định `khi nào` cần handover
4. `Runtime`
   - thực hiện chuyển agent thật, gửi context package, xử lý failover

Nói ngắn gọn:

- `Settings Agent` = cấu hình nơi chuyển đến và metadata khi chuyển
- `Campaign / Route` = chọn mặc định sẽ chuyển về đâu
- `Workflow` = quyết định thời điểm cần chuyển
- `Runtime` = thi hành hành động chuyển

---

## 3. Business goal

Agent handover tồn tại để đảm bảo:

- bot không cố xử lý những case nó không nên xử lý;
- khách hàng luôn có đường thoát sang người thật;
- doanh nghiệp kiểm soát được hàng chờ, đội tiếp nhận và context bàn giao;
- cùng một portal có thể phục vụ nhiều doanh nghiệp và nhiều ngành nghề với chính sách handover khác nhau.

Các business goal chính:

- giảm cuộc gọi rơi hoặc bế tắc do bot không hiểu;
- cho phép định tuyến khác nhau theo chiến dịch, hotline, tenant hoặc mức độ ưu tiên;
- giúp QA và vận hành nhìn rõ bot đã chuyển agent khi nào, vì sao, sang đâu;
- chuẩn hóa handover cho cả inbound lẫn outbound.

---

## 4. Các khái niệm chuẩn

### 4.1. Entry Queue

`Entry Queue` là queue tiếp nhận cuộc gọi ở đầu vào của `Inbound Route`.

Ví dụ:

- hotline thanh toán đi vào `entry_queue_payment`
- hotline VIP đi vào `entry_queue_vip`

Entry Queue không đồng nghĩa với queue handover.

### 4.2. Agent Group

`Agent Group` là nhóm người thật nhận cuộc gọi sau khi bot chuyển giao.

Ví dụ:

- `collection_l1`
- `support_l2`
- `vip_support`
- `sales_consult`

### 4.3. Handover Profile

`Handover Profile` là cấu hình chuẩn để runtime biết phải chuyển sang đâu và gửi kèm ngữ cảnh gì.

Một handover profile tối thiểu gồm:

- target agent group hoặc target queue
- priority
- max wait
- callback allowed
- failover action
- context package

### 4.4. Handover Trigger

`Handover Trigger` là lý do khiến bot phải chuyển người thật.

Ví dụ:

- khách yêu cầu gặp người
- complaint
- API fail nhiều lần
- KB không đủ chắc chắn
- bot hỏi lặp quá số lần cho phép
- policy nghiệp vụ yêu cầu người thật xử lý

### 4.5. Context Package

`Context Package` là dữ liệu được gửi sang agent khi handover.

Ví dụ:

- intent cuối cùng
- entity đã thu thập
- transcript gần nhất
- transcript đầy đủ
- API result gần nhất
- route / campaign context
- customer id / bill code / phone number

---

## 5. Phạm vi áp dụng trên toàn hệ thống

Agent handover tác động tới các module sau:

### 5.1. Settings Agent

Nơi quản lý:

- agent groups
- handover profiles
- context package templates
- global handover policies

### 5.2. Inbound Route

Nơi chọn:

- entry queue
- extension / đầu số
- default handover profile cho route đó

### 5.3. Outbound Campaign

Nơi chọn:

- campaign có cho phép handover hay không
- default handover profile của campaign
- policy xử lý nếu khách yêu cầu gặp người thật

### 5.4. Workflow

Nơi định nghĩa:

- khi nào handover
- dùng default handover profile hay override profile riêng
- thông điệp chuyển máy
- hành vi nếu handover fail

### 5.5. Preview / Runtime

Nơi thể hiện:

- bot đã quyết định handover khi nào
- handover gọi tới profile nào
- context package nào được gửi đi
- kết quả handover thành công hay thất bại

### 5.6. Reports / Dashboard

Nơi đo:

- tỷ lệ handover
- lý do handover
- handover theo campaign / route / workflow / intent
- handover success rate
- top agent groups nhận chuyển

---

## 6. Rule chuẩn cho toàn hệ thống

### 6.1. Rule 1: không dùng queue string nhập tay làm source-of-truth

Workflow không nên nhập tay `queue_payment`, `CS Team A`, `Support_L1` như text tự do.

Thay vào đó, workflow phải tham chiếu tới:

- `route_default`
- hoặc `handoverProfileId`

### 6.2. Rule 2: inbound và outbound đều phải có handover policy

Không chỉ inbound, outbound cũng phải có setup handover.

Lý do:

- khách outbound có thể xin gặp người thật;
- khách có thể complaint;
- bot có thể gặp trường hợp không nên tự xử lý tiếp.

### 6.3. Rule 3: workflow quyết định thời điểm, bot context quyết định nơi chuyển

`Workflow` phải quyết định:

- khi nào chuyển
- bằng điều kiện nào

`Campaign / Route` phải quyết định:

- chuyển mặc định về profile nào

### 6.4. Rule 4: phải có global interrupt cho request gặp người thật

Handover không chỉ xảy ra khi bot đi đúng một nhánh cụ thể trong script.

Hệ thống phải hỗ trợ `global interrupt`:

- bất kể bot đang ở prompt nào
- nếu khách nói “cho gặp người”, “cho gặp nhân viên”, “chuyển tổng đài viên”
- runtime phải có quyền nhảy sang handover

### 6.5. Rule 5: context package là cấu hình cấp profile hoặc cấp policy

Workflow không nên tự quyết từng field context phải gửi sang agent bằng cách thủ công ở từng node.

Context package nên lấy từ:

- `handover profile`
- hoặc `global settings`

Workflow chỉ có thể thêm `extra notes` nếu cần.

---

## 7. Thiết kế chuẩn theo từng module

## 7.1. Settings Agent

### Mục đích

Trở thành `source-of-truth` cho mọi thứ liên quan đến người thật nhận handover.

### Cần quản lý

1. `Agent Groups`
   - id
   - name
   - description
   - priority
   - active
   - maxWait
   - callbackAllowed

2. `Handover Profiles`
   - id
   - name
   - targetType: `agent_group | queue`
   - targetRefId
   - contextTemplateId
   - failAction
   - priority
   - active

3. `Context Templates`
   - includeIntent
   - includeEntities
   - includeRecentHistory
   - includeTranscript
   - includeApiResult
   - includeCustomerProfile

4. `Global Handover Policies`
   - escape intents
   - escape keywords
   - repeat threshold
   - confidence threshold

### Không nên làm

- không nên chỉ lưu 1 queue string duy nhất cho toàn hệ thống;
- không nên để UI “Thêm nhóm” chỉ là local state nếu muốn dùng chung cho outbound, inbound và workflow.

---

## 7.2. Inbound Route

### Mục đích

Route định nghĩa `đầu vào` của cuộc gọi.

### Nên có

- route name
- entry queue
- extension / phone number
- workflow
- knowledge base
- kb fallback
- default handover profile

### Semantics chuẩn

- `entryQueue` = route nhận cuộc gọi vào ở đâu
- `defaultHandoverProfileId` = nếu workflow cần chuyển người thật thì route này mặc định chuyển sang đâu

### Không nên làm

- không dùng `queue` một field duy nhất cho cả entry queue và handover target

---

## 7.3. Outbound Campaign

### Mục đích

Campaign định nghĩa `context business` của cuộc gọi gọi ra.

### Nên có

- campaign name
- source / data source
- workflow
- knowledge base
- kb fallback
- schedule / retry
- `handoverEnabled`
- `defaultHandoverProfileId`

### Tại sao outbound cũng cần handover

Vì khách được gọi ra có thể:

- yêu cầu gặp người thật
- khiếu nại
- yêu cầu xác minh ngoài phạm vi bot
- gặp case nhạy cảm mà bot không nên tiếp tục

### Rule chuẩn

- nếu `handoverEnabled = false`
  - workflow không được dùng handover node
  - hoặc runtime phải chặn nhánh handover và dùng fail action khác
- nếu `handoverEnabled = true`
  - campaign phải có `defaultHandoverProfileId`

---

## 7.4. Workflow

### Vai trò chuẩn của Handover node

Handover node chỉ nên quyết định:

- thông điệp bot nói trước khi chuyển
- dùng `campaign/route default profile` hay `override`
- nếu fail thì làm gì

### Cấu hình nên có trong node

- `handoverMode`: `use_default | override_profile`
- `handoverProfileId?`
- `handoverMessage`
- `onHandoverFail`

### Không nên có

- raw queue string nhập tay là mặc định

### Trigger nào nên dẫn tới handover

- intent `handover_request`
- intent `complaint`
- condition rule yêu cầu người thật
- API fail với action `transfer_agent`
- KB no-answer với action `transfer_agent`
- global escape interrupt

---

## 8. Runtime logic chuẩn

## 8.1. Inbound flow

1. khách gọi vào route
2. route xác định:
   - entry queue
   - workflow
   - default handover profile
3. workflow chạy
4. nếu gặp trigger handover:
   - runtime resolve `handover profile`
   - build `context package`
   - chuyển sang agent group

## 8.2. Outbound flow

1. bot gọi ra theo campaign
2. campaign xác định:

   - workflow
   - knowledge base
   - default handover profile

3. khách trả lời
4. nếu khách phá flow và đòi gặp người:
   - runtime detect `handover_request`
   - interrupt flow hiện tại
   - chuyển sang handover

## 8.3. Handover resolution rule

Thứ tự resolve:

1. nếu node dùng `override_profile` và profile hợp lệ -> dùng profile đó
2. nếu không -> dùng `defaultHandoverProfileId` của campaign hoặc route
3. nếu không có -> dùng `global fallback handover policy`
4. nếu vẫn không có -> fail theo `onHandoverFail`

---

## 9. Data model đề xuất

## 9.1. AgentGroup

```ts
interface AgentGroup {
  id: string;
  name: string;
  description?: string;
  priority: "low" | "normal" | "high" | "vip";
  maxWaitSec: number;
  callbackAllowed: boolean;
  active: boolean;
}
```

## 9.2. HandoverProfile

```ts
interface HandoverProfile {
  id: string;
  name: string;
  targetType: "agent_group" | "queue";
  targetRefId: string;
  contextTemplateId: string;
  failAction: "retry_transfer" | "fallback_node" | "end_call" | "callback";
  active: boolean;
}
```

## 9.3. ContextTemplate

```ts
interface HandoverContextTemplate {
  id: string;
  name: string;
  includeIntent: boolean;
  includeEntities: boolean;
  includeRecentHistory: boolean;
  includeTranscript: boolean;
  includeApiResult: boolean;
  includeCustomerProfile: boolean;
}
```

## 9.4. InboundRoute

```ts
interface InboundRoute {
  id: string;
  name: string;
  entryQueueId: string;
  extensionId: string;
  workflowId: string;
  kbId?: string;
  kbFallbackRuleId?: string;
  defaultHandoverProfileId?: string;
}
```

## 9.5. OutboundCampaign

```ts
interface OutboundCampaign {
  id: string;
  name: string;
  workflowId: string;
  kbId?: string;
  kbFallbackRuleId?: string;
  handoverEnabled: boolean;
  defaultHandoverProfileId?: string;
}
```

## 9.6. WorkflowNode

```ts
interface HandoverNode {
  type: "Handover";
  handoverMode: "use_default" | "override_profile";
  handoverProfileId?: string;
  handoverMessage?: string;
  onHandoverFail?: "fallback_node" | "retry_transfer" | "end_call";
}
```

---

## 10. UI / UX rule đề xuất

## 10.1. Settings Agent

Nên tách thành:

- `Agent Groups`
- `Handover Profiles`
- `Context Templates`
- `Global Handover Policy`

## 10.2. Inbound Create

Bước `Queue/Extension` nên đổi thành:

- `Entry Queue`
- `Extension`
- `Default Handover Profile`

## 10.3. Outbound Create

Nên thêm một block:

- `Cho phép handover`
- `Default Handover Profile`
- `Nếu khách yêu cầu gặp người thì dùng profile nào`

## 10.4. Workflow Builder

Handover node nên đổi UI từ:

- `Target queue / agent`

thành:

- `Use campaign/route default`
- `Override handover profile`
- `Handover message`
- `On handover fail`

---

## 11. Báo cáo và observability

Hệ thống nên đo các chỉ số sau:

- handover rate theo campaign
- handover rate theo inbound route
- handover rate theo workflow
- handover reason
- top intents dẫn tới handover
- handover success rate
- handover fail rate
- average wait before handover success
- top agent groups nhận chuyển

Các log runtime nên có:

- handover trigger source
- resolved handover profile id
- context package fields sent
- handover result
- fail action executed

---

## 12. Các conflict hiện tại trong prototype

Hiện tại project đang có các conflict chính:

1. `Inbound Route.queue` chưa phân biệt rõ với `handover target`
2. `Settings Agent` chưa là source-of-truth cho queue/group dùng trong workflow
3. `Workflow Handover node` đang nhập tay target queue / agent
4. `Outbound Create` chưa có setup handover ở mức campaign
5. `Inbound data model` có `handoverTo` nhưng create flow chưa cấu hình được
6. global interrupt “khách yêu cầu gặp người” chưa được mô hình hóa rõ như một năng lực runtime cấp hệ thống

---

## 13. Quyết định sản phẩm được đề xuất

### Quyết định 1

Giữ `Settings Agent` như module nền tảng, nhưng nâng nó thành `source-of-truth` thật cho handover profiles.

### Quyết định 2

Inbound và outbound đều phải chọn được `default handover profile`.

### Quyết định 3

Workflow không còn nhập tay queue string làm mặc định.

### Quyết định 4

Hỗ trợ `global handover interrupt` cho cả inbound lẫn outbound.

### Quyết định 5

Tách rõ:

- `entryQueue`
- `agentGroup`
- `handoverProfile`

để không còn lẫn nghĩa.

---

## 14. Acceptance criteria

Spec này được xem là triển khai đúng khi:

1. tạo inbound route có thể chọn `default handover profile`
2. tạo outbound campaign có thể bật/tắt `handover` và chọn profile mặc định
3. workflow handover node chỉ chọn `default` hoặc `override profile`
4. settings agent quản lý được `agent groups` và `handover profiles`
5. nếu khách outbound nói “cho gặp nhân viên” thì runtime có thể handover dù không đi đúng script
6. report xem được handover theo reason / campaign / route / profile
7. preview cho thấy context package gửi sang agent

---

## 15. Roadmap triển khai khuyến nghị

### Phase 1

- chuẩn hóa semantics
- thêm `defaultHandoverProfile` cho inbound/outbound
- đổi workflow handover node sang `use_default / override_profile`

### Phase 2

- đưa `Settings Agent` thành source-of-truth thật
- nối dropdown profile vào workflow và bot engine create
- thêm global interrupt rule

### Phase 3

- đưa reporting và preview của handover lên đầy đủ
- thêm multi-tenant routing policies
- thêm SLA / priority / callback policies

---

## 16. Kết luận ngắn

Agent handover không nên được xem là một field nhỏ trong workflow.

Nó là một `capability xuyên hệ thống` bao gồm:

- cấu hình nền tảng
- context business của bot
- logic hội thoại
- runtime execution
- reporting

Nếu không chuẩn hóa phần này, inbound, outbound và workflow sẽ tiếp tục xung đột ngữ nghĩa với nhau.
