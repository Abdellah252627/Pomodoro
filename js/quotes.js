/**
 * Quotes Module
 * Provides motivational quotes for focus mode
 */

const Quotes = (() => {
    // Private variables
    let currentQuoteIndex = -1;
    let quoteElement;
    
    // Quotes collection
    const quotes = {
        en: [
            "The secret of getting ahead is getting started.",
            "Focus on being productive instead of busy.",
            "Do the hard jobs first. The easy jobs will take care of themselves.",
            "It's not that I'm so smart, it's just that I stay with problems longer.",
            "The way to get started is to quit talking and begin doing.",
            "Don't watch the clock; do what it does. Keep going.",
            "Productivity is never an accident. It is always the result of a commitment to excellence.",
            "The most effective way to do it, is to do it.",
            "You don't have to see the whole staircase, just take the first step.",
            "The only way to do great work is to love what you do.",
            "Success is not final, failure is not fatal: It is the courage to continue that counts.",
            "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
            "The future depends on what you do today.",
            "Don't count the days, make the days count.",
            "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
            "Start where you are. Use what you have. Do what you can.",
            "The difference between ordinary and extraordinary is that little extra.",
            "The best way to predict the future is to create it.",
            "Believe you can and you're halfway there.",
            "Success is the sum of small efforts, repeated day in and day out."
        ],
        ar: [
            "سر التقدم هو البدء.",
            "ركز على أن تكون منتجًا بدلاً من أن تكون مشغولًا.",
            "قم بالمهام الصعبة أولاً. المهام السهلة ستعتني بنفسها.",
            "ليس لأنني ذكي جدًا، بل لأنني أبقى مع المشكلات لفترة أطول.",
            "الطريقة للبدء هي التوقف عن الكلام والبدء بالعمل.",
            "لا تراقب الساعة؛ افعل ما تفعله. استمر.",
            "الإنتاجية ليست أبدًا صدفة. إنها دائمًا نتيجة الالتزام بالتميز.",
            "الطريقة الأكثر فعالية للقيام بذلك، هي القيام به.",
            "لا يتعين عليك رؤية السلم بأكمله، فقط اتخذ الخطوة الأولى.",
            "الطريقة الوحيدة للقيام بعمل عظيم هي أن تحب ما تفعله.",
            "النجاح ليس نهائيًا، الفشل ليس قاتلًا: الشجاعة للاستمرار هي ما يهم.",
            "عملك سيملأ جزءًا كبيرًا من حياتك، والطريقة الوحيدة لتكون راضيًا حقًا هي أن تفعل ما تعتقد أنه عمل عظيم.",
            "المستقبل يعتمد على ما تفعله اليوم.",
            "لا تعد الأيام، اجعل الأيام تعد.",
            "الهواة يجلسون وينتظرون الإلهام، أما بقيتنا فننهض ونذهب إلى العمل.",
            "ابدأ من حيث أنت. استخدم ما لديك. افعل ما تستطيع.",
            "الفرق بين العادي والاستثنائي هو تلك الإضافة الصغيرة.",
            "أفضل طريقة للتنبؤ بالمستقبل هي إنشاؤه.",
            "آمن بأنك تستطيع وستكون قد قطعت نصف الطريق.",
            "النجاح هو مجموع الجهود الصغيرة، المتكررة يومًا بعد يوم."
        ]
    };
    
    /**
     * Initialize the quotes module
     */
    function init() {
        quoteElement = document.getElementById('focus-quote');
    }
    
    /**
     * Get a random quote
     * @returns {string} - A random quote
     */
    function getRandomQuote() {
        const language = document.documentElement.getAttribute('dir') === 'rtl' ? 'ar' : 'en';
        const languageQuotes = quotes[language];
        
        // Get a random index different from the current one
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * languageQuotes.length);
        } while (randomIndex === currentQuoteIndex && languageQuotes.length > 1);
        
        currentQuoteIndex = randomIndex;
        return languageQuotes[randomIndex];
    }
    
    /**
     * Display a quote in the focus mode
     */
    function displayQuote() {
        if (!quoteElement) return;
        
        // Fade out current quote
        quoteElement.style.opacity = 0;
        
        // After fade out, change quote and fade in
        setTimeout(() => {
            quoteElement.textContent = getRandomQuote();
            quoteElement.style.opacity = 1;
        }, 300);
    }
    
    /**
     * Start displaying quotes with a timer
     */
    function startQuoteRotation() {
        // Display initial quote
        displayQuote();
        
        // Change quote every 2 minutes
        return setInterval(displayQuote, 2 * 60 * 1000);
    }
    
    /**
     * Stop quote rotation
     * @param {number} intervalId - The interval ID to clear
     */
    function stopQuoteRotation(intervalId) {
        clearInterval(intervalId);
    }
    
    // Public API
    return {
        init,
        displayQuote,
        startQuoteRotation,
        stopQuoteRotation
    };
})();
