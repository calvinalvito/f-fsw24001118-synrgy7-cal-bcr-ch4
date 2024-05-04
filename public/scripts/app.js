class App {
    constructor() {
        this.selectDriverType = document.getElementById("driverType");
        this.inputDate = document.getElementById("carDate");
        this.selectPickupTime = document.getElementById("pickupTime");
        this.inputPassengerCount = document.getElementById("passengerCount");
        this.searchButton = document.getElementById("searchCar");
        this.carContainerElement=document.getElementById("cars-container");

        this.searchButton.addEventListener('click', this.handleSearch.bind(this));
        this.initialize();
    }

    initialize() {
        // Memanggil fungsi checkInputs saat ada perubahan pada input
        this.selectDriverType.addEventListener('change', this.checkInputs.bind(this));
        this.inputDate.addEventListener('change', this.checkInputs.bind(this));
        this.selectPickupTime.addEventListener('change', this.checkInputs.bind(this));
        this.inputPassengerCount.addEventListener('input', this.checkInputs.bind(this));

        // Memanggil fungsi load untuk mendapatkan daftar mobil saat aplikasi dimulai
        this.load();
    }
    async init() {
        await this.load();
    
        this.searchButton.onclick = this.run;
    }
    run = () => {
        Car.list.forEach((car) => {
          const node = document.createElement("div");
          node.classList.add('col-md-4')
          node.innerHTML = car.render();
          this.carContainerElement.appendChild(node);
        });
      };

    async load() {
        try {
            const cars = await Binar.listCars(); // Mendapatkan mobil dari sumber data
            localStorage.setItem("CARS", JSON.stringify(cars)); // Menyimpan data mobil ke localStorage
            const carList = JSON.parse(localStorage.getItem('CARS') || "[]"); // Mendapatkan data mobil dari localStorage
            
            const newCars = carList.map((car) => {
                const listTypeDriver = ['dengan-sopir', 'tanpa-sopir'];
                return {
                    ...car,
                    typeDriver: listTypeDriver[(Math.floor(Math.random() * listTypeDriver.length))]
                };
            });
    
            console.log("Hasil Penambahan ", newCars);
    
            this.newCars = newCars;
        } catch (error) {
            console.error("Error:", error);
        }
    }
    

    checkInputs() {
        const isDriverTypeSelected = this.selectDriverType.value !== 'Pilih Tipe Driver';
        const isDateSelected = this.inputDate.value !== '';
        const isPickupTimeSelected = this.selectPickupTime.value !== 'Pilih Waktu';
        const isPassengerCountValid = this.inputPassengerCount.value === '' || parseInt(this.inputPassengerCount.value) >= 0;

        // Mengatur atribut disabled pada tombol berdasarkan hasil pemeriksaan
        this.searchButton.disabled = !(isDriverTypeSelected && isDateSelected && isPickupTimeSelected && isPassengerCountValid);
    }

    handleSearch() {
        // Mendapatkan nilai dari setiap elemen form
        const driverType = this.selectDriverType.value;
        const carDateInput = this.inputDate.value;
        const passengerCount = this.inputPassengerCount.value;
        const pickupTime = this.selectPickupTime.value;

        const dateParts = carDateInput.split('-');
        const carDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        const carHour = parseInt(pickupTime);

        // Melakukan filter pada daftar mobil berdasarkan nilai-nilai form
        const cars = this.newCars.filter(car => {
            const availableAt = new Date(car.availableAt);
            
            return car.typeDriver === driverType && 
            car.available === true &&
            availableAt.getHours() >= carHour &&
            availableAt.getFullYear() >= carDate.getFullYear() &&
            availableAt.getMonth() >= carDate.getMonth() &&
            availableAt.getDate() >= carDate.getDate() &&
            car.capacity >= passengerCount;
        });
    
        console.log('Hasil Filter:', cars);
        Car.init(cars);
    }
    
}

