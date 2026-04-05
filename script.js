const bootLines: string[] = [
    "ASUS P8Z77-V DELUXE ACPI BIOS Revision 1805",
    "CPU: Intel(R) Core(TM) i7-3770K CPU @ 3.50GHz",
    "Speed: 3500MHz",
    "",
    "Memory Test : 16384MB OK",
    "PMU-Standard HW Profile Data Initialized.... Done.",
    "",
    "USB Devices Total: 1 Drive, 2 Keyboards, 1 Mouse",
    "Detected ATA/ATAPI Devices...",
    "SATA Port1: Samsung SSD 840 PRO Series",
    "SATA Port2: ST31000524AS",
    "",
    "Checking for Bootable Media..."
];

const logContainer = document.getElementById('boot-text');

async function runBootSequence() {
    if (!logContainer) return;

    for (const line of bootLines) {
        const lineElement = document.createElement('div');
        logContainer.appendChild(lineElement);
        
        // Simulate "processing" time for each component
        await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 100));
        lineElement.textContent = line;
        
        // Scroll to bottom
        window.scrollTo(0, document.body.scrollHeight);
    }

    // Add final blinking cursor
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    logContainer.appendChild(cursor);

    // After 3 seconds, trigger the Windows 8 loading screen
    setTimeout(() => {
        alert("BIOS complete. Transitioning to Windows 8 Loading Screen...");
    }, 3000);
}

window.onload = runBootSequence;
