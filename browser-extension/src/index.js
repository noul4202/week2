    // form fields
    const form = document.querySelector('.form-data');
    const region = document.querySelector('.region-name');
    const apiKey = document.querySelector('.api-key');
    // results
    const errors = document.querySelector('.errors');
    const loading = document.querySelector('.loading');
    const results = document.querySelector('.result');
    const usage = document.querySelector('.carbon-usage');
    const fossilfuel = document.querySelector('.fossil-fuel');
    const myregion = document.querySelector('.my-region');
    const clearBtn = document.querySelector('.clear-btn');

    form.addEventListener('submit', (e) => handleSubmit(e));
    clearBtn.addEventListener('click', (e) => reset(e));
    init();

    function reset(e) {
        e.preventDefault();
        localStorage.removeItem('regionName');
        init();
    }

    function init() {
        const storedApiKey = localStorage.getItem('apiKey');
        const storedRegion = localStorage.getItem('regionName');
        //set icon to be generic green
        //todo
        if (storedApiKey === null || storedRegion === null) {
            form.style.display = 'block';
            results.style.display = 'none';
            loading.style.display = 'none';
            clearBtn.style.display = 'none';
            errors.textContent = '';
        }
        else {
            loading.style.display = 'block';
            results.style.display = 'none';
            form.style.display = 'none';
            clearBtn.style.display = 'block';

            displayCarbonUsage(storedApiKey, storedRegion);

            loading.style.display = 'none';
            results.style.display = 'block';
        }
    };

    function handleSubmit(e) {
        e.preventDefault();
        setUpUser(apiKey.value, region.value);
    }

    function setUpUser(apiKey, regionName) {
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('regionName', regionName);
        form.style.display = 'none';
        loading.style.display = 'block';
        
        errors.textContent = '';
        clearBtn.style.display = 'block';

        displayCarbonUsage(apiKey, regionName);

        loading.style.display = 'none';

        results.style.display = 'block';
    }

    function displayCarbonUsage(apiKey, regionName) {
        myregion.textContent=regionName;
        usage.textContent='--';
        fossilfuel.textContent='--';

    }