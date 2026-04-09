import axios from 'axios';

const BACKEND_URL = 'https://be-bookstore-u8kk.onrender.com';

let booksData = [];

async function getAccessToken() {
    try {
        console.log('🔐 Đang đăng nhập...');
        const loginRes = await axios.post(`${BACKEND_URL}/api/v1/auth/login`, {
            username: 'admin@gmail.com',
            password: '123456'
        });

        const token = loginRes.data?.data?.access_token;
        if (!token) {
            throw new Error('Không lấy được access token');
        }
        console.log('✅ Đăng nhập thành công');
        return token;
    } catch (error) {
        console.error('❌ Lỗi đăng nhập:', error.response?.data || error.message);
        process.exit(1);
    }
}

async function getCategories() {
    try {
        console.log('📂 Đang lấy danh mục...');
        const res = await axios.get(`${BACKEND_URL}/api/v1/database/category`);
        const categories = res.data?.data || res.data;
        console.log('✅ Danh mục có sẵn:', categories);
        return categories;
    } catch (error) {
        console.error('❌ Lỗi lấy danh mục:', error.response?.data || error.message);
        process.exit(1);
    }
}

// Lấy ảnh bìa sách từ Open Library
async function getBookCover(title, author) {
    try {
        const query = `${title} ${author}`.replace(/\s+/g, '+');
        const res = await axios.get(`https://openlibrary.org/search.json?title=${query}&limit=1`);

        if (res.data.docs && res.data.docs.length > 0) {
            const doc = res.data.docs[0];
            if (doc.cover_id) {
                return `https://covers.openlibrary.org/b/id/${doc.cover_id}-M.jpg`;
            }
        }
    } catch (error) {
        // Silent fail - dùng placeholder nếu lỗi
    }

    // Fallback nếu không tìm được
    return 'https://via.placeholder.com/300x400?text=Book';
}

function initBooksData(categories) {
    const cat = {
        prog: categories[0] || 'Lập Trình',
        react: categories[0] || 'React',
        skill: categories[1] || 'Kỹ Năng Sống',
        business: categories[2] || 'Kinh Doanh',
        economy: categories[3] || 'Kinh Tế'
    };

    booksData = [
        { name: 'Lập Trình JavaScript Hiệu Quả', author: 'Kyle Simpson', price: 199000, category: cat.prog },
        { name: 'Clean Code', author: 'Robert C. Martin', price: 189000, category: cat.prog },
        { name: 'The Pragmatic Programmer', author: 'Andrew Hunt', price: 179000, category: cat.prog },
        { name: 'Design Patterns', author: 'Gang of Four', price: 249000, category: cat.prog },
        { name: 'Refactoring', author: 'Martin Fowler', price: 219000, category: cat.prog },
        { name: 'The Mythical Man-Month', author: 'Frederick Brooks', price: 169000, category: cat.prog },
        { name: 'Code Complete', author: 'Steve McConnell', price: 229000, category: cat.prog },
        { name: 'Thinking in Java', author: 'Bruce Eckel', price: 199000, category: cat.prog },
        { name: 'The Art of Computer Programming', author: 'Donald Knuth', price: 279000, category: cat.prog },
        { name: 'Introduction to Algorithms', author: 'CLRS', price: 239000, category: cat.prog },
        { name: 'Bắt Đầu Với React', author: 'Robin Wieruch', price: 189000, category: cat.react },
        { name: 'React Hooks in Action', author: 'John Larsen', price: 179000, category: cat.react },
        { name: 'Learning React', author: 'Alex Banks', price: 199000, category: cat.react },
        { name: 'Advanced React', author: 'Wes Bos', price: 219000, category: cat.react },
        { name: 'React Testing Library', author: 'Michael Chan', price: 169000, category: cat.react },
        { name: 'Full Stack React', author: 'Ari Lerner', price: 229000, category: cat.react },
        { name: 'Pro React', author: 'Adam Freeman', price: 249000, category: cat.react },
        { name: 'Mastering React', author: 'Cheng Lou', price: 189000, category: cat.react },
        { name: 'The Road to React', author: 'Robin Wieruch', price: 179000, category: cat.react },
        { name: 'React in Depth', author: 'Artemij Fedosejev', price: 209000, category: cat.react },
        { name: 'Đắc Nhân Tâm', author: 'Dale Carnegie', price: 140000, category: cat.skill },
        { name: 'Thói Quen Lợi Thế', author: 'Chip Kidd', price: 135000, category: cat.skill },
        { name: 'Dạy Con Kiến Thức Tài Chính', author: 'Robert Kiyosaki', price: 145000, category: cat.skill },
        { name: 'Tư Duy Nhanh và Chậm', author: 'Daniel Kahneman', price: 155000, category: cat.skill },
        { name: 'Hiệu Năng Tuyệt Đối', author: 'Robin Sharma', price: 125000, category: cat.skill },
        { name: 'Sức Mạnh Thành Công', author: 'Jack Canfield', price: 130000, category: cat.skill },
        { name: 'Đầu Tư Con Người', author: 'Bodo Schäfer', price: 140000, category: cat.skill },
        { name: 'Đặt Được Mục Tiêu', author: 'Brian Tracy', price: 135000, category: cat.skill },
        { name: 'Niềm Tin Dẫn Đến Thành Công', author: 'Joseph Murphy', price: 125000, category: cat.skill },
        { name: 'Bộ Não Sáng Tạo', author: 'Daniel Pink', price: 165000, category: cat.skill },
        { name: 'Lao Động Tập Thể', author: 'Karl Marx', price: 175000, category: cat.economy },
        { name: 'Lý Thuyết Trò Chơi', author: 'John Nash', price: 195000, category: cat.economy },
        { name: 'Quản Lý Dự Án', author: 'Rita Mulcahy', price: 185000, category: cat.business },
        { name: 'Khởi Nghiệp Tư Duy', author: 'Steve Blank', price: 165000, category: cat.business },
        { name: 'Kinh Doanh Mặt Trời Mọc', author: 'Narayana Murthy', price: 175000, category: cat.business },
        { name: 'Từ Không Đến Một Tỷ', author: 'Thiel Peter', price: 185000, category: cat.business },
        { name: 'Tác Vụ Có Ảnh Hưởng', author: 'Gary Keller', price: 155000, category: cat.business },
        { name: 'Bán Hàng Như Con Người', author: 'Blair Dunkley', price: 145000, category: cat.business },
        { name: 'Quyết Định Chiến Lược', author: 'Michael Porter', price: 205000, category: cat.business },
        { name: 'Lãnh Đạo Giàu Có', author: 'Sundar Pichai', price: 195000, category: cat.business },
    ];
}

async function addBooks(token) {
    console.log('🚀 Bắt đầu thêm 40 cuốn sách...');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < booksData.length; i++) {
        const book = booksData[i];
        try {
            // Lấy ảnh sách
            console.log(`📷 Đang lấy ảnh cho: ${book.name}...`);
            const imageUrl = await getBookCover(book.name, book.author);

            const response = await axios.post(`${BACKEND_URL}/api/v1/book`, {
                thumbnail: imageUrl,
                slider: [imageUrl],
                mainText: book.name,
                author: book.author,
                price: book.price,
                sold: Math.floor(Math.random() * 100),
                quantity: Math.floor(Math.random() * 500) + 50,
                category: book.category
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 201 || response.status === 200) {
                successCount++;
                console.log(`✅ [${i + 1}/40] Đã thêm: ${book.name}`);
            }
        } catch (error) {
            errorCount++;
            console.error(`❌ [${i + 1}/40] Lỗi thêm: ${book.name}`);
            console.error(error.response?.data || error.message);
        }

        // Delay để tránh overload
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\n📊 Kết quả: ${successCount} thành công, ${errorCount} thất bại`);
}

async function main() {
    const token = await getAccessToken();
    const categories = await getCategories();
    initBooksData(categories);
    await addBooks(token);
}

main();