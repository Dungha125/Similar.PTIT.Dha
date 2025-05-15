export function formatTimeAgo(isoString: string): string {
    const givenDate: Date = new Date(isoString);
    const now: Date = new Date();

    // Kiểm tra nếu `givenDate` không hợp lệ
    if (isNaN(givenDate.getTime())) {
        return 'Ngày không hợp lệ';
    }

    const seconds: number = Math.floor((now.getTime() - givenDate.getTime()) / 1000);
    const minutes: number = Math.floor(seconds / 60);
    const hours: number = Math.floor(minutes / 60);
    const days: number = Math.floor(hours / 24);
    const weeks: number = Math.floor(days / 7);


    if (weeks >= 1) {
        const options: Intl.DateTimeFormatOptions = {day: 'numeric', month: 'numeric', year: 'numeric'};
        return givenDate.toLocaleDateString('vi-VN', options); // Định dạng dd/mm/yyyy
    } else if (days >= 1) {
        return `${days} ngày trước`;
    } else if (hours >= 1) {
        return `${hours} giờ trước`;
    } else if (minutes >= 1) {
        return `${minutes} phút trước`;
    } else {
        return `Vừa mới`;
    }
}
