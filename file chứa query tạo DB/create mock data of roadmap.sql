ALTER TABLE Roadmap ADD FULLTEXT(name, description);

ALTER TABLE Roadmap
ADD COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

INSERT INTO Roadmap (id, accountId, teamId, name, description, isPublic, learning, teaching) VALUES
-- Lập trình Frontend & Web
('03d8a612-d153-4900-0000-000000000001', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'HTML5 Basics', 'Kiến thức nền tảng về cấu trúc web với HTML5.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000002', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'CSS3 Mastery', 'Làm chủ giao diện web, animation và responsive.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000003', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'JS Essentials', 'Cốt lõi của ngôn ngữ JavaScript từ ES6 trở lên.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000004', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'ReactJS Start', 'Bắt đầu xây dựng UI component với React.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000005', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'VueJS Guide', 'Hướng dẫn toàn diện framework VueJS.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000006', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Angular Core', 'Kiến trúc và ứng dụng enterprise với Angular.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000007', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Svelte Intro', 'Tiếp cận framework thế hệ mới Svelte.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000008', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'NextJS SSR', 'Xây dựng web render server-side với NextJS.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000009', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Tailwind CSS', 'Styling siêu tốc với Utility-first CSS.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000010', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Web Access', 'Tiêu chuẩn tiếp cận web cho mọi người dùng.', 1, 0, 0),

-- Backend & Database
('03d8a612-d153-4900-0000-000000000011', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'NodeJS API', 'Xây dựng RESTful API hiệu năng cao.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000012', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Python Django', 'Phát triển web bảo mật với Django.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000013', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Go Lang Back', 'Lập trình backend concurrency với Golang.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000014', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Java Spring', 'Spring Boot cho ứng dụng doanh nghiệp.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000015', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'C# .NET Core', 'Nền tảng .NET đa nền tảng hiện đại.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000016', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'SQL Master', 'Truy vấn dữ liệu phức tạp và tối ưu hóa.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000017', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'MongoDB NoSQL', 'Quản trị cơ sở dữ liệu dạng văn bản.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000018', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Redis Cache', 'Tối ưu tốc độ với bộ nhớ đệm Redis.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000019', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'PostgreSQL', 'Hệ quản trị CSDL quan hệ mã nguồn mở mạnh mẽ.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000020', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'GraphQL API', 'Ngôn ngữ truy vấn dữ liệu linh hoạt.', 1, 0, 0),

-- DevOps & Cloud
('03d8a612-d153-4900-0000-000000000021', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Docker Zero', 'Đóng gói ứng dụng với Container.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000022', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'K8s Cluster', 'Quản lý container quy mô lớn với Kubernetes.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000023', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'AWS Basic', 'Nhập môn điện toán đám mây Amazon.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000024', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Azure Cloud', 'Giải pháp đám mây của Microsoft.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000025', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'CI/CD Pipe', 'Tự động hóa quy trình deploy phần mềm.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000026', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Linux Cmd', 'Thành thạo dòng lệnh Linux server.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000027', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Git Version', 'Quản lý mã nguồn và làm việc nhóm.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000028', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Nginx Config', 'Cấu hình Web Server và Reverse Proxy.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000029', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Terraform IaC', 'Quản lý hạ tầng như mã nguồn.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000030', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'CyberSec 101', 'Nhập môn an toàn thông tin mạng.', 1, 0, 0),

-- Mobile App
('03d8a612-d153-4900-0000-000000000031', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Flutter App', 'Làm app đa nền tảng với Dart.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000032', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'React Native', 'Dùng kiến thức React để làm app mobile.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000033', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Swift iOS', 'Lập trình ứng dụng cho iPhone/iPad.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000034', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Kotlin Dev', 'Phát triển ứng dụng Android hiện đại.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000035', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Unity Game', 'Làm game 2D/3D với C#.', 1, 0, 0),

-- Data Science & AI
('03d8a612-d153-4900-0000-000000000036', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Data Analyst', 'Phân tích dữ liệu với Excel và SQL.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000037', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Pandas Py', 'Xử lý dữ liệu lớn với thư viện Pandas.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000038', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Machine Learn', 'Các thuật toán học máy cơ bản.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000039', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Deep Learning', 'Mạng nơ-ron nhân tạo và Deep Learning.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000040', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'AI Chatbot', 'Xây dựng chatbot thông minh.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000041', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Computer Vis', 'Xử lý ảnh và thị giác máy tính.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000042', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'PowerBI Dash', 'Trực quan hóa dữ liệu doanh nghiệp.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000043', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Big Data', 'Xử lý dữ liệu lớn với Hadoop/Spark.', 1, 0, 0),

-- Design & Creative
('03d8a612-d153-4900-0000-000000000044', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'UI Design', 'Thiết kế giao diện người dùng đẹp mắt.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000045', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'UX Research', 'Nghiên cứu trải nghiệm người dùng.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000046', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Figma Tool', 'Thành thạo công cụ Figma từ A-Z.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000047', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Color Theory', 'Lý thuyết màu sắc trong thiết kế số.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000048', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Typography', 'Nghệ thuật sử dụng chữ viết.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000049', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Photoshop', 'Chỉnh sửa ảnh chuyên nghiệp.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000050', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Illustrator', 'Vẽ vector và thiết kế đồ họa.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000051', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Video Edit', 'Dựng phim với Premiere Pro.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000052', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Motion Graph', 'Đồ họa chuyển động với After Effects.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000053', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, '3D Modeling', 'Dựng hình 3D với Blender.', 1, 0, 0),

-- Soft Skills
('03d8a612-d153-4900-0000-000000000054', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Leadership', 'Kỹ năng lãnh đạo đội nhóm hiệu quả.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000055', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Time Manage', 'Quản lý thời gian và tối ưu năng suất.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000056', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Public Speak', 'Nghệ thuật nói chuyện trước đám đông.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000057', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Negotiation', 'Kỹ năng đàm phán và thương lượng.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000058', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Critical Thk', 'Tư duy phản biện trong công việc.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000059', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Emotional EQ', 'Trí tuệ cảm xúc và giao tiếp.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000060', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Teamwork', 'Làm việc nhóm và giải quyết xung đột.', 1, 0, 0),

-- Marketing & Business
('03d8a612-d153-4900-0000-000000000061', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'SEO Ranking', 'Tối ưu hóa công cụ tìm kiếm Google.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000062', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Content Mkt', 'Chiến lược tiếp thị nội dung số.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000063', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Social Media', 'Quản trị thương hiệu trên mạng xã hội.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000064', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Email Mkt', 'Tiếp thị qua email tự động hóa.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000065', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Google Ads', 'Chạy quảng cáo Google hiệu quả.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000066', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Facebook Ads', 'Quảng cáo nhắm mục tiêu Facebook.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000067', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Startup 101', 'Khởi nghiệp và xây dựng mô hình kinh doanh.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000068', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Personal Fin', 'Quản lý tài chính cá nhân cơ bản.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000069', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Stock Market', 'Đầu tư chứng khoán cho người mới.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000070', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'E-commerce', 'Kinh doanh thương mại điện tử.', 1, 0, 0),

-- Language & Culture
('03d8a612-d153-4900-0000-000000000071', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'English Biz', 'Tiếng Anh thương mại và công sở.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000072', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'IELTS Prep', 'Luyện thi chứng chỉ IELTS.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000073', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Japanese N5', 'Tiếng Nhật sơ cấp cho người mới.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000074', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Chinese Basic', 'Tiếng Trung giao tiếp cơ bản.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000075', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Korean Start', 'Học bảng chữ cái và giao tiếp tiếng Hàn.', 1, 0, 0),

-- Hobbies & Life
('03d8a612-d153-4900-0000-000000000076', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Photography', 'Nhiếp ảnh cơ bản và bố cục.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000077', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Guitar Basic', 'Học đệm hát guitar cơ bản.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000078', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Piano Solo', 'Luyện ngón và bản nhạc piano.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000079', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Cooking 101', 'Kỹ thuật nấu ăn gia đình ngon.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000080', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Baking Cake', 'Làm bánh ngọt và trang trí.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000081', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Yoga Daily', 'Yoga cơ bản cho sức khỏe dẻo dai.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000082', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Meditation', 'Thiền định giúp giảm căng thẳng.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000083', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Calisthenics', 'Tập gym tại nhà không cần tạ.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000084', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Nutrition', 'Dinh dưỡng khoa học cho cơ thể.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000085', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'First Aid', 'Sơ cấp cứu cơ bản trong đời sống.', 1, 0, 0),

-- Advanced Tech
('03d8a612-d153-4900-0000-000000000086', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Blockchain', 'Công nghệ chuỗi khối và ứng dụng.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000087', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Smart Contract', 'Lập trình hợp đồng thông minh Solidity.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000088', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'IoT Arduino', 'Internet vạn vật với vi điều khiển.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000089', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Rust System', 'Lập trình hệ thống an toàn với Rust.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000090', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Assembly', 'Ngôn ngữ máy và kiến trúc máy tính.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000091', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Algorithm', 'Cấu trúc dữ liệu và giải thuật.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000092', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Design Pttn', 'Các mẫu thiết kế phần mềm kinh điển.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000093', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Microservice', 'Kiến trúc Microservices phân tán.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000094', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Serverless', 'Điện toán phi máy chủ AWS Lambda.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000095', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Web3 Intro', 'Tổng quan về Web 3.0 và DApps.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000096', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Testing QA', 'Kiểm thử phần mềm tự động.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000097', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Agile Scrum', 'Quy trình phát triển phần mềm linh hoạt.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000098', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Product Mgt', 'Quản lý sản phẩm công nghệ.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000099', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Vim Editor', 'Thành thạo trình soạn thảo Vim.', 1, 0, 0),
('03d8a612-d153-4900-0000-000000000100', '2a1fa820-049c-80ef-0509-cdff743ce8c6', NULL, 'Clean Code', 'Nghệ thuật viết code sạch và dễ đọc.', 1, 0, 0);