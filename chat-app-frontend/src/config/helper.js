export function getTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000); // difference in seconds

    if (diff < 60) return `${diff} second${diff !== 1 ? 's' : ''} ago`;
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(diff / 3600);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(diff / 86400);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    const months = Math.floor(diff / 2592000); // 30 days
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
    const years = Math.floor(diff / 31536000); // 365 days
    return `${years} year${years !== 1 ? 's' : ''} ago`;
}
