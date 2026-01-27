import { Capacitor } from "@capacitor/core";
import { Toast } from "@capacitor/toast";

let container: HTMLDivElement | null = null;

function createContainer() {
    container = document.createElement("div");
    container.className =
        "fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none";
    document.body.appendChild(container);
}

function showWebToast(message: string) {
    if (!container) createContainer();

    const toast = document.createElement("div");
    toast.className = `
    pointer-events-auto
    min-w-[260px] max-w-[360px]
    bg-gray-900 text-white
    px-4 py-3 rounded-xl shadow-lg
    flex items-center gap-3
    animate-slide-in
    opacity-0
    transition-all duration-300
  `;

    toast.innerHTML = `
    <div class="flex-1 text-sm font-medium">${message}</div>
    <button class="text-gray-400 hover:text-white transition">✕</button>
  `;

    container!.appendChild(toast);

    // animate in
    requestAnimationFrame(() => {
        toast.classList.remove("opacity-0");
    });

    // close button
    const closeBtn = toast.querySelector("button")!;
    closeBtn.onclick = () => removeToast(toast);

    // auto remove
    setTimeout(() => removeToast(toast), 3000);
}

function removeToast(toast: HTMLDivElement) {
    toast.classList.add("opacity-0", "translate-x-4");
    setTimeout(() => toast.remove(), 300);
}

export const notify = async (message: string) => {
    if (Capacitor.isNativePlatform()) {
        await Toast.show({
            text: message,
            duration: "short",
            position: "bottom",
        });
    } else {
        showWebToast(message);
    }
};


export const formatGrade = (grade) => {
    return grade
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const gradeOrderMap = {
    PRE_NURSERY: 0,
    NURSERY: 1,
    LKG: 2,
    UKG: 3,
    GRADE_1: 4,
    GRADE_2: 5,
    GRADE_3: 6,
    GRADE_4: 7,
    GRADE_5: 8,
    GRADE_6: 9,
    GRADE_7: 10,
    GRADE_8: 11,
    GRADE_9: 12,
    GRADE_10: 13,
    GRADE_11: 14,
    GRADE_12: 15,
};