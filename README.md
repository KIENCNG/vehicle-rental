# 🚗 VeloRent – HỆ THỐNG QUẢN LÝ CHO THUÊ PHƯƠNG TIỆN

<p align="center">
  <b>VEHICLE RENTAL MANAGEMENT SYSTEM</b><br>
  Hệ thống quản lý cho thuê ô tô và xe máy hiện đại – tiện lợi – hiệu quả
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-Spring%20Boot-6DB33F?logo=springboot" />
  <img src="https://img.shields.io/badge/Frontend-ReactJS-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql" />
  <img src="https://img.shields.io/badge/Build-Maven-C71A36?logo=apachemaven" />
  <img src="https://img.shields.io/badge/Version_Control-GitHub-181717?logo=github" />
</p>

---

## 📘 1. Giới thiệu dự án

**VeloRent** là hệ thống quản lý cho thuê phương tiện giao thông được xây dựng trên nền tảng web, sử dụng ReactJS cho giao diện người dùng, Java Spring Boot cho backend và MySQL để quản lý dữ liệu.

Hệ thống hướng đến việc số hóa quy trình cho thuê ô tô và xe máy, hỗ trợ quản lý phương tiện, khách hàng, yêu cầu thuê và hợp đồng. Người quản trị có thể tiếp nhận, duyệt hoặc từ chối yêu cầu thuê, theo dõi trạng thái hợp đồng và xử lý quá trình trả xe.

Dự án được thực hiện trong khuôn khổ học tập tại Trường Đại học Phenikaa, tập trung áp dụng kiến thức lập trình hướng đối tượng, xây dựng ứng dụng web và tổ chức hệ thống theo mô hình phân lớp.

### 🎯 Mục tiêu dự án

- Xây dựng hệ thống quản lý cho thuê phương tiện trên nền tảng web.
- Hỗ trợ quản lý thông tin ô tô, xe máy và khách hàng.
- Quản lý yêu cầu thuê và hợp đồng một cách có hệ thống.
- Tự động tính chi phí thuê theo thời gian sử dụng.
- Kiểm tra thời gian thuê để hạn chế trùng lịch phương tiện.
- Xây dựng REST API bằng Java Spring Boot.
- Kết nối và lưu trữ dữ liệu bằng MySQL.
- Tổ chức mã nguồn rõ ràng, thuận tiện bảo trì và mở rộng.

---

## ⚙️ 2. Chức năng chính

### 🚘 2.1. Quản lý phương tiện

Hệ thống hỗ trợ quản lý thông tin phương tiện cho thuê.

Các chức năng:

- Thêm phương tiện mới.
- Cập nhật thông tin phương tiện.
- Xóa phương tiện.
- Hiển thị danh sách phương tiện.
- Quản lý thông tin biển số, hãng xe và giá thuê.
- Phân loại phương tiện thành ô tô và xe máy.

### 👥 2.2. Quản lý khách hàng

Hỗ trợ quản lý thông tin khách hàng sử dụng dịch vụ thuê phương tiện.

Các chức năng:

- Lưu trữ thông tin khách hàng.
- Hiển thị danh sách khách hàng.
- Theo dõi thông tin khách hàng liên quan đến hợp đồng thuê.
- Quản lý dữ liệu khách hàng phục vụ nghiệp vụ cho thuê.

### 📄 2.3. Quản lý yêu cầu thuê và hợp đồng

Đây là chức năng nghiệp vụ quan trọng của hệ thống.

- Tiếp nhận yêu cầu thuê phương tiện.
- Kiểm tra thời gian thuê.
- Kiểm tra trùng lịch thuê xe.
- Tự động tính tổng tiền thuê.
- Admin duyệt yêu cầu thuê.
- Admin từ chối yêu cầu thuê.
- Theo dõi trạng thái hợp đồng.
- Xử lý trả xe.
- Xử lý hủy hợp đồng.

### 📊 2.4. Quản lý trạng thái hợp đồng

Hệ thống sử dụng các trạng thái hợp đồng:

| Trạng thái   | Ý nghĩa                                             |
| ------------ | --------------------------------------------------- |
| Chờ xác nhận | Yêu cầu thuê đang chờ Admin xử lý                   |
| Đang thuê    | Yêu cầu đã được duyệt và phương tiện đang được thuê |
| Đã trả       | Khách hàng đã hoàn tất việc trả phương tiện         |
| Đã hủy       | Hợp đồng hoặc yêu cầu thuê đã bị hủy                |

### 💰 2.5. Tính toán chi phí thuê

Hệ thống hỗ trợ tự động tính tổng tiền thuê dựa trên giá thuê theo ngày và thời gian thuê.

**Công thức tổng quát:**

```text
Tổng tiền thuê = Giá thuê mỗi ngày × Số ngày thuê
```

Việc tính toán được xử lý ở backend nhằm đảm bảo tính nhất quán của dữ liệu nghiệp vụ.

---

## 💻 3. Công nghệ sử dụng

| Thành phần          | Công nghệ triển khai              |
| ------------------- | --------------------------------- |
| Ngôn ngữ Backend    | Java                              |
| Backend Framework   | Spring Boot                       |
| Frontend Framework  | ReactJS                           |
| Ngôn ngữ Frontend   | JavaScript                        |
| Giao tiếp dữ liệu   | REST API                          |
| ORM                 | Hibernate / Spring Data JPA       |
| Cơ sở dữ liệu       | MySQL                             |
| Build tool          | Maven                             |
| Frontend build tool | Vite                              |
| Quản lý mã nguồn    | Git và GitHub                     |
| IDE                 | IntelliJ IDEA, Visual Studio Code |

### 🧩 Vai trò của từng công nghệ

- **ReactJS:** Xây dựng giao diện người dùng và các thành phần giao diện.
- **Java Spring Boot:** Xử lý nghiệp vụ và cung cấp API cho frontend.
- **Spring Data JPA:** Hỗ trợ truy vấn và thao tác dữ liệu.
- **MySQL:** Lưu trữ thông tin phương tiện, khách hàng và hợp đồng.
- **GitHub:** Quản lý phiên bản và cộng tác phát triển dự án.

---

## 🧠 4. Kiến trúc và thiết kế hệ thống

VeloRent được tổ chức theo mô hình Client – Server, phân chia frontend và backend thành hai khu vực riêng biệt.

### 4.1. Sơ đồ kiến trúc tổng quát

```text
             ┌─────────────────────────┐
             │       NGƯỜI DÙNG        │
             └────────────┬────────────┘
                          │
             ┌────────────▼────────────┐
             │       REACTJS           │
             │       FRONTEND          │
             │                         │
             │   Giao diện khách hàng  │
             │   Giao diện quản trị    │
             └────────────┬────────────┘
                          │
                       REST API
                          │
             ┌────────────▼────────────┐
             │     SPRING BOOT         │
             │        BACKEND          │
             │                         │
             │      Controller        │
             │      Service            │
             │      Repository         │
             │      Model              │
             └────────────┬────────────┘
                          │
             ┌────────────▼────────────┐
             │         MYSQL           │
             │        DATABASE         │
             └─────────────────────────┘
```

### 4.2. Kiến trúc Backend

Backend được chia thành các package theo trách nhiệm:

| Package      | Vai trò                                 |
| ------------ | --------------------------------------- |
| `main`       | Chứa lớp khởi chạy ứng dụng             |
| `handler`    | Xử lý các thành phần hỗ trợ và phản hồi |
| `model`      | Chứa các lớp mô hình dữ liệu            |
| `repository` | Làm việc với cơ sở dữ liệu              |
| `service`    | Xử lý logic nghiệp vụ                   |
| `utils`      | Chứa các tiện ích dùng chung            |

### 4.3. Kiến trúc Frontend

Frontend sử dụng ReactJS, chia giao diện thành các thành phần để thuận tiện phát triển và bảo trì.

Các khu vực chính:

- Giao diện quản trị Admin.
- Các thành phần quản lý phương tiện.
- Các thành phần quản lý khách hàng.
- Các thành phần quản lý hợp đồng.
- Các tiện ích kết nối API.
- Các tệp CSS định dạng giao diện.

---

## 🧬 5. Áp dụng lập trình hướng đối tượng (OOP)

Dự án vận dụng bốn tính chất cơ bản của lập trình hướng đối tượng.

| Tính chất                | Cách áp dụng                                                               |
| ------------------------ | -------------------------------------------------------------------------- |
| Đóng gói (Encapsulation) | Đóng gói dữ liệu trong các lớp và kiểm soát truy cập thông qua phương thức |
| Kế thừa (Inheritance)    | Các loại phương tiện kế thừa từ lớp phương tiện cơ sở                      |
| Trừu tượng (Abstraction) | Sử dụng lớp trừu tượng để mô tả đặc điểm chung của phương tiện             |
| Đa hình (Polymorphism)   | Xử lý các loại phương tiện thông qua kiểu dữ liệu chung                    |

### 5.1. Sơ đồ kế thừa phương tiện

```text
                  PhuongTien
               (Abstract Class)
                       |
              ┌────────┴────────┐
              |                 |
             OTo               XeMay
              |                 |
          Số chỗ ngồi       Dung tích xi-lanh
          Loại nhiên liệu   Kiểu xe
```

### 5.2. Ý nghĩa của thiết kế OOP

- Giảm sự trùng lặp mã nguồn.
- Tăng khả năng tái sử dụng.
- Dễ dàng bổ sung loại phương tiện mới.
- Giúp phân chia trách nhiệm giữa các lớp.
- Hỗ trợ bảo trì và mở rộng hệ thống.

---

## 🗄️ 6. Cơ sở dữ liệu

Hệ thống sử dụng MySQL để lưu trữ và quản lý dữ liệu.

### 6.1. Các nhóm dữ liệu chính

| Entity        | Vai trò                                |
| ------------- | -------------------------------------- |
| `PhuongTien`  | Lưu thông tin chung của phương tiện    |
| `OTo`         | Lưu thông tin riêng của ô tô           |
| `XeMay`       | Lưu thông tin riêng của xe máy         |
| `KhachHang`   | Lưu thông tin khách hàng               |
| `HopDongThue` | Lưu thông tin yêu cầu và hợp đồng thuê |

### 6.2. Quan hệ dữ liệu khái quát

```text
                 KhachHang
                     |
                     | 1 - N
                     |
                 HopDongThue
                     |
                     | N - 1
                     |
                  PhuongTien
                     |
              ┌──────┴──────┐
              |             |
             OTo           XeMay
```

_Lưu ý: Sơ đồ trên mô tả quan hệ nghiệp vụ khái quát. Cần đối chiếu với entity và cấu hình quan hệ JPA hiện tại để hoàn thiện ERD chính thức._

---

## 🔌 7. REST API

Backend cung cấp REST API để frontend gửi yêu cầu và nhận dữ liệu.

### 🚘 7.1. API quản lý phương tiện

| Method | Endpoint                | Chức năng                 |
| ------ | ----------------------- | ------------------------- |
| GET    | `/api/phuong-tien`      | Lấy danh sách phương tiện |
| GET    | `/api/phuong-tien/{id}` | Lấy thông tin phương tiện |
| POST   | `/api/phuong-tien`      | Thêm phương tiện          |
| PUT    | `/api/phuong-tien/{id}` | Cập nhật phương tiện      |
| DELETE | `/api/phuong-tien/{id}` | Xóa phương tiện           |

### 📄 7.2. API quản lý hợp đồng

| Method | Endpoint                        | Chức năng              |
| ------ | ------------------------------- | ---------------------- |
| GET    | `/api/hop-dong`                 | Lấy danh sách hợp đồng |
| GET    | `/api/hop-dong/{id}`            | Lấy chi tiết hợp đồng  |
| POST   | `/api/hop-dong`                 | Tạo hợp đồng           |
| POST   | `/api/hop-dong/yeu-cau`         | Tiếp nhận yêu cầu thuê |
| PUT    | `/api/hop-dong/{id}`            | Cập nhật hợp đồng      |
| PATCH  | `/api/hop-dong/{id}/trang-thai` | Cập nhật trạng thái    |

_Lưu ý: Các endpoint cần được kiểm tra lại với Controller thực tế trước khi dùng làm tài liệu tích hợp chính thức._

---

## 🧪 8. Kiểm thử

Dự án đã thực hiện kiểm thử ở cả backend và frontend.

### 8.1. Kiểm thử Backend

Các nội dung kiểm thử:

- Kiểm tra hoạt động của các lớp mô hình.
- Kiểm tra logic xử lý dữ liệu.
- Kiểm tra API tiếp nhận yêu cầu thuê.
- Kiểm tra chức năng Admin duyệt yêu cầu.
- Kiểm tra các trường hợp dữ liệu đầu vào không hợp lệ.

### 8.2. Kiểm thử Frontend

- Kiểm tra quá trình build frontend.
- Kiểm tra giao diện quản trị.
- Kiểm tra kết nối API.
- Kiểm tra thao tác quản lý phương tiện và hợp đồng.

### 8.3. Kết quả kiểm thử đã ghi nhận

- Backend chạy thành công 14 bài test.
- Frontend build thành công.
- Đã kiểm tra API tạo yêu cầu thuê.
- Đã kiểm tra chức năng Admin duyệt yêu cầu.

---

## 🚀 9. Hướng dẫn triển khai

### 🔹 Bước 1: Chuẩn bị môi trường

Cài đặt các công cụ:

- Java JDK.
- Node.js và npm.
- MySQL Server.
- Git.
- IntelliJ IDEA hoặc Visual Studio Code.

### 🔹 Bước 2: Tải mã nguồn

```bash
git clone https://github.com/KIENCNG/vehicle-rental.git
cd vehicle-rental
```

### 🔹 Bước 3: Cấu hình cơ sở dữ liệu

Tạo database MySQL:

```sql
CREATE DATABASE vehicle_rental;
```

Mở file cấu hình `application.properties` của Backend và thiết lập thông tin kết nối MySQL phù hợp với máy tính.

Không đưa mật khẩu database thật lên GitHub.

### 🔹 Bước 4: Khởi chạy Backend

Mở Terminal tại thư mục Backend, nơi chứa Maven Wrapper:

```bash
./mvnw spring-boot:run
```

Backend mặc định chạy tại:

```text
http://localhost:8080
```

### 🔹 Bước 5: Khởi chạy Frontend

Mở Terminal tại thư mục frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend được chạy bằng Vite. Địa chỉ truy cập sẽ hiển thị trong Terminal, thường là:

```text
http://localhost:5173
```

### 🔹 Bước 6: Kiểm tra kết nối

Có thể kiểm tra API health:

```bash
curl http://localhost:8080/api/health
```

---

## 🔄 10. Quy trình hoạt động

### 👤 10.1. Quy trình khách hàng

```text
       Truy cập hệ thống
               |
               ▼
         Xem phương tiện
               |
               ▼
       Chọn phương tiện thuê
               |
               ▼
       Chọn thời gian thuê
               |
               ▼
        Gửi yêu cầu thuê
               |
               ▼
       Chờ Admin xác nhận
               |
               ▼
       Theo dõi trạng thái
               |
               ▼
         Hoàn tất thuê xe
```

### 🛠️ 10.2. Quy trình Admin

```text
          Đăng nhập Admin
                 |
                 ▼
        Quản lý phương tiện
                 |
                 ▼
         Tiếp nhận yêu cầu
                 |
                 ▼
         Kiểm tra thông tin
                 |
           ┌─────┴─────┐
           ▼           ▼
         Duyệt       Từ chối
           |
           ▼
      Quản lý hợp đồng
           |
           ▼
         Trả xe
           |
           ▼
     Cập nhật trạng thái
```

---

## 📷 11. Giao diện hệ thống

Hình ảnh giao diện thực tế sẽ được bổ sung tại thư mục `docs/images/`.

### 11.1. Giao diện quản trị

**Admin Dashboard**

![Admin Dashboard](docs/images/admin-dashboard.png)

**Quản lý phương tiện**

![Quản lý phương tiện](docs/images/vehicle-management.png)

**Quản lý khách hàng**

![Quản lý khách hàng](docs/images/customer-management.png)

**Quản lý hợp đồng**

![Quản lý hợp đồng](docs/images/contract-management.png)

### 11.2. Giao diện khách hàng

Các màn hình dành cho khách hàng sẽ được bổ sung khi hoàn thiện:

- Trang chủ giới thiệu dịch vụ.
- Danh sách phương tiện.
- Chi tiết phương tiện.
- Đăng ký và đăng nhập.
- Gửi yêu cầu thuê.
- Lịch sử thuê xe.

---

## 📊 12. Sơ đồ và tài liệu thiết kế

Các sơ đồ thiết kế có thể được lưu tại thư mục `docs/diagrams/`.

| Tài liệu            | Nội dung                    |
| ------------------- | --------------------------- |
| UML Class Diagram   | Sơ đồ lớp của hệ thống      |
| Use Case Diagram    | Sơ đồ chức năng người dùng  |
| Activity Diagram    | Sơ đồ hoạt động nghiệp vụ   |
| Sequence Diagram    | Sơ đồ tuần tự xử lý         |
| ERD                 | Sơ đồ quan hệ cơ sở dữ liệu |
| System Architecture | Sơ đồ kiến trúc hệ thống    |

---

## 🚧 13. Định hướng phát triển

Các chức năng dự kiến tiếp tục triển khai:

- [ ] Hoàn thiện giao diện khách hàng.
- [ ] Hoàn thiện đăng ký và đăng nhập.
- [ ] Xây dựng phân quyền khách hàng và Admin.
- [ ] Hoàn thiện trang chủ giới thiệu dịch vụ.
- [ ] Hoàn thiện tìm kiếm và lọc phương tiện.
- [ ] Xây dựng lịch sử thuê xe theo tài khoản.
- [ ] Bổ sung thông báo trạng thái yêu cầu thuê.
- [ ] Hoàn thiện giao diện responsive.
- [ ] Tích hợp thanh toán trực tuyến VNPay hoặc MoMo.
- [ ] Quản lý tiền đặt cọc và trạng thái thanh toán.
- [ ] Bổ sung thống kê và báo cáo.
- [ ] Kiểm thử toàn bộ hệ thống trước khi triển khai thực tế.

**Lưu ý:** Thanh toán trực tuyến và các chức năng chưa hoàn thiện được xem là định hướng phát triển, không phải chức năng đã triển khai thành công.

---

## 👨‍💻 14. Thông tin dự án

| Thông tin    | Nội dung                                                            |
| ------------ | ------------------------------------------------------------------- |
| Tên dự án    | VeloRent                                                            |
| Loại dự án   | Hệ thống quản lý cho thuê phương tiện                               |
| Trường       | Đại học Phenikaa                                                    |
| Backend      | Java Spring Boot                                                    |
| Frontend     | ReactJS                                                             |
| Database     | MySQL                                                               |
| Repository   | [KIENCNG/vehicle-rental](https://github.com/KIENCNG/vehicle-rental) |
| Branch chính | `main`                                                              |

---

## 🌟 15. Lời tri ân

Nhóm thực hiện xin gửi lời cảm ơn chân thành tới giảng viên hướng dẫn và Trường Đại học Phenikaa đã tạo điều kiện để sinh viên thực hiện dự án.

Thông qua quá trình xây dựng VeloRent, nhóm có cơ hội vận dụng kiến thức lập trình hướng đối tượng, Java, Spring Boot, ReactJS và cơ sở dữ liệu MySQL vào một bài toán thực tế.

Dự án cũng là cơ hội để rèn luyện tư duy phân tích nghiệp vụ, thiết kế hệ thống, kiểm thử phần mềm và quản lý mã nguồn bằng GitHub.

---

## ✅ 16. Kết luận

VeloRent là dự án xây dựng hệ thống quản lý cho thuê phương tiện với kiến trúc frontend – backend tách biệt.

Các phần đã triển khai tập trung vào:

- Quản lý phương tiện.
- Quản lý thông tin khách hàng.
- Tiếp nhận và xử lý yêu cầu thuê.
- Quản lý hợp đồng và trạng thái.
- Kiểm tra trùng lịch thuê.
- Tự động tính tổng tiền thuê.
- Kết nối ReactJS với Java Spring Boot và MySQL.

Hệ thống tiếp tục được phát triển nhằm hoàn thiện trải nghiệm khách hàng, phân quyền và thanh toán trực tuyến.

---

## 📚 17. License

Dự án được thực hiện với mục đích học tập và nghiên cứu trong khuôn khổ chương trình đào tạo tại Trường Đại học Phenikaa.

Mọi nội dung và mã nguồn thuộc repository của dự án VeloRent.

---

<p align="center">
  <b>🚗 VeloRent – Vehicle Rental Management System</b><br>
  Built with ❤️ using ReactJS, Java Spring Boot and MySQL
</p>
💐 Lời tri ân
Nhóm chúng em xin gửi lời cảm ơn chân thành tới Thầy Trần Đình Nam Sơn đã tận tình hướng dẫn, hỗ trợ và truyền cảm hứng trong suốt quá trình thực hiện dự án.

Thông qua dự án này, nhóm không chỉ được rèn luyện kỹ năng lập trình với Java – Spring Boot, mà còn học hỏi cách làm việc nhóm, tư duy thiết kế hệ thống phần mềm và ứng dụng công nghệ vào thực tế.

🌟 “Chúng em kính chúc Thầy luôn mạnh khỏe, hạnh phúc và tiếp tục truyền cảm hứng học tập cho sinh viên trong các học phần tiếp theo.”

✅ Kết luận
✅ Hoàn thiện đầy đủ chức năng: CRUD, kiểm thử, thống kê, validate
✅ Thiết kế theo mô hình chuẩn MVC, phân lớp rõ ràng
✅ Giao diện thân thiện, có thể demo thực tế qua DevTunnel
✅ Sẵn sàng mở rộng REST API, phân quyền, cloud storage, tích hợp thanh toán
📚 License
Dự án được phát triển với mục tiêu học tập tại Đại học Phenikaa.
Không sử dụng cho mục đích thương mại nếu không có sự cho phép từ nhóm phát triển.

📩 Mọi thắc mắc, vui lòng liên hệ qua email: 23010747@st.phenikaa-uni.edu.vn
