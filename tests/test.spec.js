import { test, expect } from '@playwright/test';

// Helper: đăng nhập admin (selector cụ thể tránh strict mode)
async function login(page) {
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: /Tài khoản$/ }).click();
    // Chỉ lấy tiêu đề modal (exact) tránh trùng với nút Đăng nhập
    const modalTitle = page.getByText('Đăng Nhập', { exact: true });
    await expect(modalTitle).toBeVisible();
    await page.getByPlaceholder('Nhập email của bạn').fill('admin@gmail.com');
    await page.getByPlaceholder('Nhập mật khẩu của bạn').fill('123456');
    const submitBtn = page.getByRole('button', { name: 'Đăng nhập' });
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();
    await expect(page.getByRole('button', { name: 'Admin down' })).toBeVisible();
}

test.describe('Test tổng quan chức năng BookStore', () => {
    test('Đăng nhập hiển thị Admin menu', async ({ page }) => {
        await login(page);
    });

    test('Bộ lọc danh mục & sắp xếp & tìm kiếm', async ({ page }) => {
        await login(page);
        const category = page.locator('#category');
        await expect(category).toBeVisible();
        for (const name of ['Arts', 'Business', 'Comics']) {
            const item = category.getByText(name);
            if (await item.isVisible()) await item.click();
        }
        await page.getByRole('button', { name: 'Xóa bộ lọc' }).click();
        for (const btn of ['Hàng Mới', 'Giá Thấp', 'Giá Cao', 'Phổ Biến']) {
            await page.getByRole('button', { name: btn }).click();
            await page.waitForTimeout(150);
        }
        await page.getByRole('textbox', { name: 'Bạn tìm sách gì hôm nay?' }).fill('Clean');
        await page.getByRole('button', { name: 'Tìm kiếm' }).click();
        await page.waitForTimeout(300);
    });

    test('Thêm sản phẩm đầu tiên vào giỏ và mở giỏ', async ({ page }) => {
        await login(page);
        const firstThumb = page.locator('.thumbnail > img').first();
        await expect(firstThumb).toBeVisible();
        await firstThumb.click();
        const addBtn = page.getByRole('button', { name: 'Thêm vào giỏ hàng' });
        await expect(addBtn).toBeVisible();
        await addBtn.click();
        const action = page.locator('.header__action');
        if (await action.isVisible()) {
            await action.click();
            const viewCartBtn = page.getByRole('button', { name: 'Xem giỏ hàng' });
            if (await viewCartBtn.isVisible()) {
                await viewCartBtn.click();
                await expect(page.getByText(/Giỏ Hàng|giỏ hàng/i)).toBeVisible();
            }
        }
    });

    test('Đi tới trang quản trị và duyệt các mục chính', async ({ page }) => {
        // Tăng timeout cho bước điều hướng nhiều lần
        test.setTimeout(60_000);
        await login(page);
        await page.getByRole('button', { name: 'Admin down' }).click();
        await page.getByRole('link', { name: 'Trang quản trị' }).click();
        await expect(page).toHaveURL(/\/admin$/);

        // Giới hạn phạm vi vào sidebar menu để tránh các link thống kê / quick actions
        const sidebarMenu = page.getByRole('menu');
        const navTargets = [
            { name: 'Books', url: /\/admin\/book$/ },
            { name: 'Orders', url: /\/admin\/order$/ },
            { name: 'Users', url: /\/admin\/user$/ }
        ];

        for (const { name, url } of navTargets) {
            const link = sidebarMenu.getByRole('link', { name, exact: true });
            await expect(link).toBeVisible();
            await link.click();
            await expect(page).toHaveURL(url);
        }
    });

    test('Đăng xuất thành công', async ({ page }) => {
        await login(page);
        await page.getByRole('button', { name: 'Admin down' }).click();
        await page.getByText('Đăng xuất').click();
        await expect(page.getByRole('button', { name: 'user Tài khoản' })).toBeVisible();
    });
});