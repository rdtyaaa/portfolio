// Semua teks per mode. Alur: kenalan > pilih mode > motivasi kantong > kuliah > BTN > WISEWIRES > BRI > skill > kontak
export const MODES = ["goys", "yoga", "en"];

export const COPY = {
  goys: {
    compact: {"hero.b": "Temen-temen manggil gua Goys. Kerja di QA, tapi masih suka kepikiran: 'ini kalau gua bikin sendiri bisa ga, ya?'", "mode.t": "Orangnya sama. Pilih cara ngobrolnya.", "mode.b": "Santai, kerjaan, atau English. Tinggal pilih.", "why.t": "Dulu pengen kantong Doraemon.", "why.b": "Butuh apa, tinggal ambil. Pas gede baru sadar: gua harus belajar dulu sebelum bisa bikin sesuatu.", "why.b2": "Jadi gua isi kantong sendiri: ngoding pas kuliah, ketelitian dari QA, sama hasil ngulik. Belum selesai, masih gua tambahin.", "uni.t": "Awalnya mau jadi developer.", "uni.b": "Di SI Telkom gua seneng bikin web dan chatbot. Sampai jadi asprak, aslab, ngajarin 30-an mahasiswa. Kebayangnya: lulus, jadi dev.", "btn.t": "Magangnya malah masuk QA.", "btn.b": "Di BTN gua ditaruh di QA, sampai otomasi 100+ test case pake Tosca. QA nemu bug, dev yang kepikiran sampai jam 2. Gua udah tidur. Gua cocok di sini, jadi beloknya sengaja.", "ww.t": "Kerja pertama, beda jam.", "ww.b": "Lewat WISEWIRES gua ngetes aplikasi iOS dan Android. Timnya di luar, jadi belajar Inggris beneran. Mereka baru bangun, gua udah nahan ngantuk.", "bri.t": "Terus masuk bank gede.", "bri.b": "Di BRI gua jadi IT QA trainee BFLP, ngetes fraud detection. Yang dijagain duit orang beneran. Prosedur sampai cara chat ikut rapi. Topengnya gua pake dulu.", "skill.intro": "Banyak yang udah dipelajarin, lebih banyak yang belum. Masih gua isi terus.", "skill.sum.b": "Dari game latihan strategi sampai startpage buat cewek gua. Ini beberapa yang gua bikin.", "skill.sum.projectsTitle": "Beberapa yang udah jadi", "contact.t": "Nyampe sini, kita udah kenal.", "contact.b": "Ngobrolin QA, ngulik, atau bikin sesuatu bareng? Kabarin aja."},
    ui: { scroll: "scroll", unzip: "scroll buat buka resletingnya", click: "klik kantongnya kalo penasaran", loading: "ngubek kantong…" },
    hero: {
      k: "Halo",
      t: "Gua Yoga.",
      b: "Temen-temen manggil gua Goys. Sekarang kerja di QA. Di luar kerjaan, gua masih suka kepikiran, 'ini kalau gua bikin sendiri bisa ga, ya?'",
      bubble: ["ini hasil ngulik kemarin", "yang ini masih gua pelajarin", "nambah satu bekal lagi", "eh, nyambung juga ilmunya"],
      closed: "resletingnya kebuka kalo lu scroll"
    },
    mode: {
      k: "Sebelum lanjut",
      t: "Gua punya tiga mode. Pilih yang paling cocok buat lu.",
      b: "Orangnya sama, cara ngomongnya yang beda. Kayak lu ngomong ke temen nongkrong, ke atasan, sama ke orang luar.",
      cards: {
        goys: { who: "buat temen tongkrongan", sample: "\"Eh, gua lagi ngulik ESP32 nih, biar AC kamar bisa diatur dari HP.\"" },
        yoga: { who: "buat urusan kerjaan", sample: "\"Saat ini saya sedang mempelajari IoT dengan ESP32 untuk mengatur AC melalui ponsel.\"" },
        en: { who: "for international folks", sample: "\"I'm tinkering with an ESP32 so I can control my AC from my phone.\"" }
      },
      note: "klik salah satu kartu. bisa diganti lagi kapan aja, di sini atau di pojok kanan atas", picked: "dipake"
    },
    why: {
      k: "Ngomong-ngomong, soal kantong ini",
      t: "Dulu pengen kantong Doraemon.",
      b: "Butuh apa, tinggal ambil. Enak banget kayaknya. Pas gede, baru sadar: kalau gua pengen bisa bikin sesuatu, ya gua mesti belajar dulu.",
      b2: "Jadi gua ngumpulin isi kantong sendiri. Ngoding dari kuliah, ketelitian dari QA, ditambah hasil ngulik ke mana-mana. Isinya belum lengkap. Masih gua tambahin.",
      list: ["kuliah & ngajarin", "bekal ngoding", "kerja jadi QA", "belajar ngeliat detail", "ngulik hal baru", "nambah isi kantong"]

    },
    uni: {
      k: "2021 - 2025 · Telkom University",
      t: "Awalnya gua mau jadi developer.",
      b: "Masuk SI Telkom, paling seneng kalau tugasnya bikin sesuatu. Web, sistem informasi, sampai chatbot WhatsApp. Gua juga jadi asprak dan aslab, ngajarin 30-an mahasiswa ngoding. Jadi kebayangnya ya habis lulus lanjut jadi dev.",
      jobs: { t: "sambilan pas kuliah", rows: [["Asprak OOP · Java", "2023"], ["Aslab konten · ESD Lab", "2023-24"], ["Asprak ADSI · UML", "2024"], ["Asprak Aplikasi Web · 30+ mhs", "2024"], ["Sertifikasi Web Developer · BNSP", "Des 2024"]], foot: "lulus Agustus 2025 · IPK 3,59" },
      tag: "Laptop Ngebul",
      term: ["$ php artisan serve   # PGII-Connect", "server jalan di :8000", "$ ollama run llama3.2", ">>> halo kak, mau pesen apa?", "$ git commit -m \"fix dikit\"", "[main 3f2a1c] fix dikit (yang ke-14)", "fan: 6200 rpm  ▲▲▲"],
      tl: [["2021", "masuk SI Telkom"], ["BNSP", "sertifikasi Web Developer"], ["2024", "magang"], ["2025", "lulus"]]
    },
    btn: {
      k: "2024 · Magang di BTN",
      t: "Eh, magangnya malah masuk QA.",
      b: "Di BTN, gua malah ditempatin di QA. Sempat otomasi 100+ test case pake Tosca. Dari situ gua lihat: gua yang nemu bug, dev yang kepikiran sampai jam 2. Gua? Udah tidur. Ternyata gua lebih cocok di sini. Jadi beloknya sengaja.",
      tag: "Rambu DEV / QA",
      chart: { t: "siapa mikirin bug sampe jam berapa", qa: "nemu, laporin, pulang 17:00", dev: "mikirin bug-nya sampe 02:00", foot: "* data: mata kepala sendiri. salam hormat buat para dev." },
      stat: "test case gua otomasi pake Tricentis Tosca selama magang",
      turn: "belok ke QA →", next: "lanjut ke Surabaya ↓"
    },
    ww: {
      k: "2025 - 2026 · Ordo Apps via WISEWIRES",
      t: "Kerja pertama, jamnya beda jauh.",
      b: "Lewat WISEWIRES gua ngetes aplikasi iOS dan Android, dari awal develop sampai rilis. Timnya di luar, jadi mesti belajar Inggris yang beneran dipake kerja. Kadang mereka baru bangun, gua udah nahan ngantuk.",
      tag: "Batu Loncatan",
      me: "gua · WIB", team: "tim · sana", meS: "nahan ngantuk", teamS: "baru bangun",
      eng: { t: "bahasa Inggris gua", rows: [["bulan 1", "Sorry, can you repeat that?"], ["bulan 4", "I think this is a bug, let me check."], ["bulan 8", "Repro steps attached. Blocking release."]] },
      ck: ["Regression", "Smoke test", "Hotfix check", "Functional", "Rilis aman"]
    },
    bri: {
      k: "2026 - sekarang · BRI",
      t: "Terus masuk bank gede.",
      b: "Di BRI gua jadi IT QA trainee lewat BFLP, ngetes sistem fraud detection. Yang dijagain duit orang beneran. Semua ada prosedurnya, sampai cara chat juga ikut rapi. Dari yang biasa bilang \"bro\", sekarang jadi \"Izin Bapak/Ibu\". Topengnya gua pake dulu.",
      tag: "Topeng Korporat",
      memo: { h: "Perihal: temuan defect", dulu: "dulu, di kantor sendalan", old: "bro ini error ya", skrg: "sekarang", new: "Izin Bapak/Ibu, berikut kami sampaikan temuan defect beserta langkah reproduksinya." },
      flow: ["transaksi", "rules fraud", "alert", "dites gua"]
    },
    skill: {
      k: "Masih ngisi kantong",
      intro: "Kelihatannya udah banyak. Tapi tiap ngulik, ketemu lagi sama yang belum gua ngerti. Jadi kantong ini masih gua isi terus.",
      gauge: "bekal sejauh ini", pre: "Bekal yang beda-beda, ketemu di satu kantong.",
      faster: "scroll buat ngintip isi bekalnya", go: "satu-satu, jadi bekal baru",
      cats: { qa: "kerjaan · QA", code: "bekal kuliah · ngoding", ulik: "ngulik · bikin alat sendiri" },
      sum: { k: "Jadi, gua orangnya gini", t: "Suka ngulik. Suka ngide. Kalo ada ide, langsung gua cobain.",
             b: "Gua suka kalau yang awalnya cuma kepikiran akhirnya bisa dipake. Kadang buat latihan, kadang buat cewek gua, kadang buat bantu jualan. Ini beberapa yang sempat gua bikin.",
             tags: ["gampang penasaran", "langsung nyoba", "QA buat kerjaan, ngulik buat hidup"], next: "scroll buat kenalan beneran ↓" , think: "Ngide. Ngulik.", make: "Terus gua jadiin.", projectsTitle: "Bukan cuma kepikiran. Ini beberapa hasil isengnya.", projectLink: "lihat repo", projects: [{"title": "Strategic Thinking Simulation", "kind": "main sambil mikir", "body": "Pengen ngasah strategic thinking. Jadinya bikin game iseng buat latihan mikir strategi.", "url": "https://github.com/rdtyaaa/StrategicThinkingSimulation"}, {"title": "Couple Startpage", "kind": "buat cewek gua", "body": "Bikin halaman awal browser buat cewek gua. Tema bisa diganti-ganti, biar buka tab baru ga gitu-gitu aja.", "url": "https://github.com/rdtyaaa/couple-startpage"}, {"title": "Flowfy", "kind": "bikin yang kepake", "body": "Katalog buket buat Flowfy. Orang bisa lihat-lihat produknya, terus lanjut pesen lewat WhatsApp.", "url": "https://github.com/rdtyaaa/flowfy"}]},
      hot: { esp32: ["ESP32", "ngulik IoT"], pensil: ["Pensil", "UI design"], arsitektur: ["Coretan", "arsitektur sistem"], sendal_hermes: ["Sendal Hermes", "AI agent bikinan gua"] }
    },
    contact: { k: "Udah, segitu dulu", t: "Kalo lu nyampe sini, kita udah kenal.", b: "Mau ngobrolin QA, AI agent, IoT, atau bikin alat bareng? Kabarin aja." }
  },

  yoga: {
    compact: {"hero.b": "Saya Yoga Raditya, QA di BRI. Saya tetap senang mencoba membuat sesuatu sendiri, sambil menambah bekal di luar pekerjaan.", "mode.t": "Pilih gaya bahasa yang sesuai.", "mode.b": "Santai, profesional, atau bahasa Inggris.", "why.t": "Berawal dari kantong Doraemon.", "why.b": "Dulu ingin bisa mengambil alat apa saja. Sekarang saya belajar caranya agar bisa membuat sesuatu sendiri.", "why.b2": "Kuliah memberi bekal pengembangan, QA melatih ketelitian. Eksperimen menambah isinya lagi. Proses belajarnya belum selesai.", "uni.t": "Semula ingin menjadi developer.", "uni.b": "Di Sistem Informasi Telkom saya membangun web dan chatbot, menjadi asisten praktikum serta lab, dan mengajar 30+ mahasiswa. Awalnya ingin melanjutkan sebagai developer.", "btn.t": "Magang membawa saya ke QA.", "btn.b": "Di BTN saya mengotomasi 100+ test case dengan Tosca. Saya menikmati proses menemukan masalah, lalu memilih melanjutkan karier di QA.", "ww.t": "Belajar bekerja lintas zona waktu.", "ww.b": "QA aplikasi iOS dan Android melalui WISEWIRES. Saya belajar memakai bahasa Inggris sehari-hari dan menjaga fokus saat jam tim berbeda jauh.", "bri.t": "Beradaptasi di lingkungan BRI.", "bri.b": "Sekarang IT QA Trainee BFLP di BRI, menguji fraud detection. Saya belajar mengikuti prosedur dan menyesuaikan komunikasi untuk lingkungan korporat.", "skill.intro": "Setiap pengalaman menambah bekal. Masih banyak yang ingin saya pelajari.", "skill.sum.b": "Game latihan strategi, startpage personal, hingga katalog Flowfy. Beberapa ide yang saya wujudkan.", "skill.sum.projectsTitle": "Pilihan proyek personal", "contact.t": "Mari berkenalan lebih lanjut.", "contact.b": "Terbuka untuk diskusi QA, AI agent, dan kolaborasi."},
    ui: { scroll: "scroll", unzip: "scroll untuk membuka", click: "kantongnya bisa diklik", loading: "memuat…" },
    hero: {
      k: "Perkenalan",
      t: "Saya Yoga Raditya.",
      b: "Saya Yoga Raditya, QA di BRI dan lulusan Sistem Informasi Telkom University. Kantong ini mewakili pengetahuan, keterampilan, dan pengalaman yang terus saya kembangkan.",
      bubble: ["sedang dicari…", "sebentar, masih di dalam", "satu per satu, ya"],
      closed: "scroll untuk membuka resletingnya"
    },
    mode: {
      k: "Sebelum melanjutkan",
      t: "Halaman ini tersedia dalam tiga gaya bahasa.",
      b: "Isinya sama, penyampaiannya menyesuaikan pembaca.",
      cards: {
        goys: { who: "santai, untuk teman", sample: "\"Eh, gua lagi ngulik ESP32 nih, biar AC kamar bisa diatur dari HP.\"" },
        yoga: { who: "profesional", sample: "\"Saat ini saya sedang mempelajari IoT dengan ESP32 untuk mengatur AC melalui ponsel.\"" },
        en: { who: "untuk pembaca internasional", sample: "\"I'm tinkering with an ESP32 so I can control my AC from my phone.\"" }
      },
      note: "klik salah satu kartu. dapat diganti kapan saja, di sini atau di kanan atas", picked: "aktif"
    },
    why: {
      k: "Cerita di balik kantong",
      t: "Berawal dari kantong Doraemon.",
      b: "Dulu saya membayangkan bisa mengambil alat apa saja dari kantong itu. Sekarang, kalau ingin membuat sesuatu, saya perlu belajar caranya lebih dulu.",
      b2: "Dari kuliah saya membawa bekal pengembangan. Dari QA saya belajar ketelitian. Eksperimen pribadi menambah isinya lagi, dan masih banyak yang ingin saya pelajari.",
      list: ["kuliah & mengajar", "fondasi pengembangan", "pekerjaan QA", "ketelitian pengujian", "eksplorasi mandiri", "pengetahuan baru"]

    },
    uni: {
      k: "2021 - 2025 · Telkom University",
      t: "Semula ingin menjadi developer.",
      b: "Saat kuliah Sistem Informasi di Telkom, saya senang mengembangkan web dan chatbot. Saya juga menjadi asisten praktikum dan lab, mengajar lebih dari 30 mahasiswa. Pengalaman itu membuat saya membayangkan karier sebagai developer.",
      jobs: { t: "pengalaman selama kuliah", rows: [["Asisten Praktikum PBO · Java", "2023"], ["Asisten Lab Divisi Konten · ESD", "2023-24"], ["Asisten Praktikum ADSI · UML", "2024"], ["Asisten Praktikum Aplikasi Web", "2024"], ["Sertifikasi Web Developer · BNSP", "Des 2024"]], foot: "lulus Agustus 2025 · IPK 3,59" },
      tag: "Laptop Kuliah",
      term: ["$ php artisan serve   # PGII-Connect", "server berjalan di :8000", "$ ollama run llama3.2", ">>> halo, ada yang bisa dibantu?", "$ git commit -m \"feat: pembayaran midtrans\"", "[main 3f2a1c] feat: pembayaran midtrans"],
      tl: [["2021", "Sistem Informasi, Telkom University"], ["BNSP", "sertifikasi Web Developer"], ["2024", "magang QA, Bank BTN"], ["2025", "lulus"]]
    },
    btn: {
      k: "2024 · Magang di Bank BTN",
      t: "Magang membawa saya ke QA.",
      b: "Di BTN saya ditempatkan di QA dan mengotomasi lebih dari 100 test case dengan Tosca. Saya menikmati proses menemukan masalah dan menelusuri penyebabnya. Dari pengalaman itu saya memilih melanjutkan karier di QA.",
      tag: "Persimpangan Karier",
      chart: { t: "ilustrasi: alur penanganan defect", qa: "defect dilaporkan", dev: "analisis dan perbaikan", foot: "* ilustrasi ringan, bukan data resmi" },
      stat: "test case diotomasi dengan Tricentis Tosca",
      turn: "fokus QA →", next: "berikutnya: Surabaya ↓"
    },
    ww: {
      k: "2025 - 2026 · Ordo Apps melalui WISEWIRES",
      t: "Lalu bekerja lintas zona waktu.",
      b: "Melalui WISEWIRES saya menangani QA aplikasi iOS dan Android hingga rilis. Tim internasional membuat saya terbiasa memakai bahasa Inggris sehari-hari. Perbedaan jam kerja juga berarti belajar menjaga fokus saat sudah mengantuk.",
      tag: "Batu Loncatan",
      me: "saya · WIB", team: "tim · zona lain", meS: "malam di sini", teamS: "pagi di sana",
      eng: { t: "perkembangan komunikasi", rows: [["bulan 1", "Sorry, can you repeat that?"], ["bulan 4", "I think this is a bug, let me check."], ["bulan 8", "Repro steps attached. Blocking release."]] },
      ck: ["Regression", "Smoke test", "Hotfix", "Functional", "Siap rilis"]
    },
    bri: {
      k: "2026 - sekarang · Bank BRI",
      t: "Beradaptasi di lingkungan BRI.",
      b: "Kini saya IT QA Trainee BFLP di BRI, menguji sistem fraud detection. Saya beradaptasi dengan prosedur kerja yang lebih terstruktur, tanggung jawab pada transaksi nasabah, dan cara berkomunikasi di lingkungan korporat.",
      tag: "Topeng Korporat",
      memo: { h: "Perihal: temuan defect", dulu: "sebelumnya", old: "ini error ya", skrg: "sekarang", new: "Berikut temuan defect beserta langkah reproduksi dan expected result-nya." },
      flow: ["transaksi", "rules fraud", "alert", "pengujian"]
    },
    skill: {
      k: "Terus menambah bekal",
      intro: "Setiap pengalaman menambah bekal, tetapi juga menunjukkan hal yang belum saya pahami. Saya masih terus belajar.",
      gauge: "bekal sejauh ini", pre: "Beragam pengalaman, satu bekal yang terus berkembang.",
      faster: "scroll untuk menjelajahi bekal saya", go: "terus belajar dan menghubungkan pengalaman",
      cats: { qa: "pekerjaan · QA", code: "pengembangan", ulik: "eksplorasi" },
      sum: { k: "Ringkasnya", t: "Senang mengeksplorasi, banyak ide, dan terbiasa langsung mencobanya.",
             b: "Saya terbiasa memvalidasi ide dengan prototipe kecil, lalu belajar dari hasilnya. Di pekerjaan saya teliti mencari kesalahan, di luar pekerjaan saya membangun hal baru.",
             tags: ["rasa ingin tahu tinggi", "cepat mencoba", "teliti di pekerjaan"], next: "scroll untuk kontak ↓" , think: "Dari ide dan eksplorasi,", make: "menjadi karya.", projectsTitle: "Beberapa proyek personal yang saya realisasikan.", projectLink: "lihat repositori", projects: [{"title": "Strategic Thinking Simulation", "kind": "eksperimen game", "body": "Game personal untuk berlatih dan mengasah cara berpikir strategis.", "url": "https://github.com/rdtyaaa/StrategicThinkingSimulation"}, {"title": "Couple Startpage", "kind": "pengalaman personal", "body": "Halaman awal browser untuk pasangan, dengan pilihan tema dan tampilan yang dapat disesuaikan.", "url": "https://github.com/rdtyaaa/couple-startpage"}, {"title": "Flowfy", "kind": "katalog produk", "body": "Website katalog buket Flowfy dengan alur pemesanan melalui WhatsApp.", "url": "https://github.com/rdtyaaa/flowfy"}]},
      hot: { esp32: ["ESP32", "IoT"], pensil: ["Desain", "UI design"], arsitektur: ["Diagram", "arsitektur sistem"], sendal_hermes: ["Hermes", "AI agent pribadi"] }
    },
    contact: { k: "Penutup", t: "Terima kasih sudah membaca.", b: "Saya terbuka untuk diskusi seputar quality engineering, AI agent, maupun kolaborasi." }
  },

  en: {
    compact: {"hero.b": "Friends call me Goys. I work in QA, but I still find myself thinking, 'could I build that myself?'", "mode.t": "Same person. Pick your language.", "mode.b": "Casual Indonesian, professional, or English.", "why.t": "I wanted Doraemon's pocket.", "why.b": "Need something? Reach in and grab it. These days I have to learn how before I can build it.", "why.b2": "So I fill my own: coding from uni, an eye for bugs from QA, and things I learn by tinkering. Still plenty of room.", "uni.t": "I thought I would be a developer.", "uni.b": "At Telkom I built websites and chatbots, became a lab and practicum assistant, and taught 30-odd students. Becoming a dev seemed like the next step.", "btn.t": "Then I landed in QA.", "btn.b": "At BTN I automated 100+ test cases with Tosca. QA finds the bug; the dev thinks about it at 2 AM. I am already asleep. QA suited me, so I stayed.", "ww.t": "First job, different hours.", "ww.b": "Testing iOS and Android apps through WISEWIRES meant learning working English. Sometimes the overseas team was waking up while I was fighting sleep.", "bri.t": "Then came the big-bank job.", "bri.b": "IT QA trainee at BRI, testing fraud detection. Real money, stricter procedures, and a different chat tone. Time for the corporate mask.", "skill.intro": "Every new thing shows me something I do not know yet. Still filling this pocket.", "skill.sum.b": "A strategy game, a start page for my girlfriend, and a catalogue for Flowfy. Some things I have built.", "skill.sum.projectsTitle": "A few personal projects", "contact.t": "We are basically friends now.", "contact.b": "Want to talk QA, tinkering, or building together? Say hi."},
    ui: { scroll: "scroll", unzip: "scroll to unzip it", click: "click the pocket if you're curious", loading: "digging through the pocket…" },
    hero: {
      k: "Hi",
      t: "I'm Yoga.",
      b: "Friends call me Goys. I work in QA, but outside work I still catch myself thinking, 'could I build that myself?'",
      bubble: ["hold on, looking…", "where did I put it", "one thing at a time", "here it… nope"],
      closed: "it unzips when you scroll"
    },
    mode: {
      k: "Before we go on",
      t: "I come in three modes. Pick the one that fits you.",
      b: "Same person, different way of talking. Like how you talk to your friends, your boss, and someone from abroad.",
      cards: {
        goys: { who: "for my friends (Indonesian)", sample: "\"Eh, gua lagi ngulik ESP32 nih, biar AC kamar bisa diatur dari HP.\"" },
        yoga: { who: "for work (Indonesian)", sample: "\"Saat ini saya sedang mempelajari IoT dengan ESP32 untuk mengatur AC melalui ponsel.\"" },
        en: { who: "for international folks", sample: "\"I'm tinkering with an ESP32 so I can control my AC from my phone.\"" }
      },
      note: "click a card. switch anytime, here or top right", picked: "active"
    },
    why: {
      k: "About this pocket",
      t: "I used to want Doraemon's pocket.",
      b: "Whatever you need, just reach in and grab it. These days, if I want to build something, I have to learn how first.",
      b2: "So I have been filling my own pocket. Coding from uni, an eye for problems from QA, and bits I pick up by tinkering. There is still plenty of room in there.",
      list: ["studying & teaching", "learning to build", "working in QA", "learning to notice details", "trying new things", "adding to the pocket"]

    },
    uni: {
      k: "2021 - 2025 · Telkom University",
      t: "I thought I would become a developer.",
      b: "At Telkom I liked assignments that meant building something: websites, information systems, even a WhatsApp chatbot. I became a lab and practicum assistant and taught 30-odd students to code. Becoming a developer seemed like the next step.",
      jobs: { t: "side jobs during uni", rows: [["OOP practicum assistant · Java", "2023"], ["Lab content assistant · ESD Lab", "2023-24"], ["Systems design assistant · UML", "2024"], ["Web app assistant · 30+ students", "2024"], ["Web Developer cert · BNSP", "Dec 2024"]], foot: "graduated Aug 2025 · GPA 3.59" },
      tag: "The Overheating Laptop",
      term: ["$ php artisan serve   # PGII-Connect", "server running on :8000", "$ ollama run llama3.2", ">>> hi! what would you like to order?", "$ git commit -m \"small fix\"", "[main 3f2a1c] small fix (the 14th one)", "fan: 6200 rpm  ▲▲▲"],
      tl: [["2021", "Information Systems"], ["BNSP", "Web Developer cert"], ["2024", "internship"], ["2025", "graduated"]]
    },
    btn: {
      k: "2024 · Internship at BTN",
      t: "Then my internship put me in QA.",
      b: "At BTN I automated over 100 test cases with Tosca. I also noticed the division of labour: QA finds the bug, the dev is still thinking about it at 2 AM. Me? Already asleep. QA suited me, so I chose to stick with it.",
      tag: "The DEV / QA Sign",
      chart: { t: "who thinks about the bug until when", qa: "found, reported, home by 5 PM", dev: "puzzling over it until 2 AM", foot: "* source: my own eyes. respect to all devs." },
      stat: "test cases I automated with Tricentis Tosca during the internship",
      turn: "turn to QA →", next: "next stop: Surabaya ↓"
    },
    ww: {
      k: "2025 - 2026 · Ordo Apps via WISEWIRES",
      t: "My first team worked different hours.",
      b: "Through WISEWIRES I tested iOS and Android apps from early builds to release. Working with an overseas team meant learning English I actually had to use. Sometimes they were just waking up while I was fighting sleep.",
      tag: "The Stepping Stone",
      me: "me · WIB", team: "team · there", meS: "fighting sleep", teamS: "just woke up",
      eng: { t: "my English", rows: [["month 1", "Sorry, can you repeat that?"], ["month 4", "I think this is a bug, let me check."], ["month 8", "Repro steps attached. Blocking release."]] },
      ck: ["Regression", "Smoke test", "Hotfix check", "Functional", "Safe to ship"]
    },
    bri: {
      k: "2026 - now · BRI",
      t: "Then came the big-bank job.",
      b: "Now I am an IT QA trainee in BRI's BFLP, testing fraud detection systems. They look after real people's money. The procedures are stricter, and even the way I message people has changed. That is where the corporate mask comes in.",
      tag: "The Corporate Mask",
      memo: { h: "Re: defect findings", dulu: "back at the chill office", old: "bro this is broken", skrg: "now", new: "Dear all, please find the defect below, along with the steps to reproduce." },
      flow: ["transaction", "fraud rules", "alert", "tested by me"]
    },
    skill: {
      k: "Still filling the pocket",
      intro: "Every new thing I try shows me something else I do not know yet. I am still filling this pocket.",
      gauge: "what I have learned so far", pre: "Different lessons, coming together in one pocket.",
      faster: "scroll to explore what is inside", go: "one more lesson to build on",
      cats: { qa: "work · QA", code: "from uni · coding", ulik: "tinkering · my own tools" },
      sum: { k: "So, that's me", t: "I tinker. I get ideas. When I get one, I just try it.",
             b: "Whether it works out comes later. Try first, take it apart, learn from it. At work I look for what's broken. After work I look for what I can build.",
             tags: ["easily curious", "tries things fast", "QA for work, tinkering for life"], next: "scroll to actually say hi ↓" , think: "Ideas. Tinkering.", make: "Then I build it.", projectsTitle: "A few things that made it out of my head.", projectLink: "view repository", projects: [{"title": "Strategic Thinking Simulation", "kind": "play and think", "body": "A just-for-fun game I built to practise strategic thinking.", "url": "https://github.com/rdtyaaa/StrategicThinkingSimulation"}, {"title": "Couple Startpage", "kind": "for my girlfriend", "body": "A browser start page for my girlfriend, with switchable themes and a personal touch.", "url": "https://github.com/rdtyaaa/couple-startpage"}, {"title": "Flowfy", "kind": "something useful", "body": "A bouquet catalogue for Flowfy, with a path from browsing products to ordering on WhatsApp.", "url": "https://github.com/rdtyaaa/flowfy"}]},
      hot: { esp32: ["ESP32", "IoT tinkering"], pensil: ["Pencil", "UI design"], arsitektur: ["Sketch", "system architecture"], sendal_hermes: ["Hermes sandals", "my own AI agent"] }
    },
    contact: { k: "That's it for now", t: "If you made it here, we're basically friends.", b: "Up for a chat about QA, AI agents, IoT, or building something together? Reach out." }
  }
};

export const SKILLS = [
  [
    "Agile",
    "qa"
  ],
  [
    "Bitbucket",
    "qa"
  ],
  [
    "NLP",
    "code"
  ],
  [
    "Machine Learning",
    "code"
  ],
  [
    "UML",
    "code"
  ],
  [
    "Full-stack Web",
    "code"
  ],
  [
    "Database Design",
    "code"
  ],
  [
    "Hotfix Validation",
    "qa"
  ],
  [
    "OOP",
    "code"
  ],
  [
    "Retesting",
    "qa"
  ],
  [
    "System Analysis",
    "code"
  ],
  [
    "Python",
    "code"
  ],
  [
    "Cross-device Testing",
    "qa"
  ],
  [
    "Git",
    "code"
  ],
  [
    "React.js",
    "code"
  ],
  [
    "Scrum",
    "qa"
  ],
  [
    "SQL",
    "qa"
  ],
  [
    "API Testing",
    "qa"
  ],
  [
    "End-to-End Order Flow",
    "qa"
  ],
  [
    "Katalon",
    "qa"
  ],
  [
    "Mobile Testing iOS",
    "qa"
  ],
  [
    "CSS",
    "code"
  ],
  [
    "Functional Testing",
    "qa"
  ],
  [
    "Test Scenario",
    "qa"
  ],
  [
    "Data Analysis",
    "code"
  ],
  [
    "Bug Triage",
    "qa"
  ],
  [
    "Visual Paradigm",
    "code"
  ],
  [
    "PHP",
    "code"
  ],
  [
    "Activity Diagram",
    "code"
  ],
  [
    "Payment Flow Validation",
    "qa"
  ],
  [
    "Defect Reporting",
    "qa"
  ],
  [
    "HTML",
    "code"
  ],
  [
    "GitHub",
    "code"
  ],
  [
    "Jira",
    "qa"
  ],
  [
    "REST API",
    "code"
  ],
  [
    "Manual Testing",
    "qa"
  ],
  [
    "Midtrans",
    "code"
  ],
  [
    "Laravel",
    "code"
  ],
  [
    "Postman",
    "qa"
  ],
  [
    "Traceability",
    "qa"
  ],
  [
    "Repro Steps",
    "qa"
  ],
  [
    "Web Testing",
    "qa"
  ],
  [
    "Java",
    "code"
  ],
  [
    "DB2 Query",
    "qa"
  ],
  [
    "Tricentis Tosca",
    "qa"
  ],
  [
    "UAT",
    "qa"
  ],
  [
    "Test Automation",
    "qa"
  ],
  [
    "MySQL",
    "code"
  ],
  [
    "Laravel Breeze",
    "code"
  ],
  [
    "WebSocket",
    "code"
  ],
  [
    "RBAC",
    "code"
  ],
  [
    "ESP32",
    "ulik",
    "esp32"
  ],
  [
    "IoT",
    "ulik",
    "esp32"
  ],
  [
    "IR Remote AC",
    "ulik",
    "esp32"
  ],
  [
    "Sensor",
    "ulik",
    "esp32"
  ],
  [
    "Smart Home",
    "ulik",
    "esp32"
  ],
  [
    "UI Design",
    "ulik",
    "pensil"
  ],
  [
    "UX Flow",
    "ulik",
    "pensil"
  ],
  [
    "Wireframe",
    "ulik",
    "pensil"
  ],
  [
    "Prototyping",
    "ulik",
    "pensil"
  ],
  [
    "Hi-fi Mockup",
    "ulik",
    "pensil"
  ],
  [
    "Design System",
    "ulik",
    "pensil"
  ],
  [
    "Postman Collection",
    "qa"
  ],
  [
    "Test Plan",
    "qa"
  ],
  [
    "SAP Testing",
    "qa"
  ],
  [
    "Deployment Testing",
    "qa"
  ],
  [
    "WhatsApp API",
    "code"
  ],
  [
    "Smoke Testing",
    "qa"
  ],
  [
    "Order Completion Check",
    "qa"
  ],
  [
    "SIT",
    "qa"
  ],
  [
    "Tosca TestCase Design",
    "qa"
  ],
  [
    "Backtesting Rules",
    "qa"
  ],
  [
    "Sprint Review",
    "qa"
  ],
  [
    "Class Diagram",
    "code"
  ],
  [
    "Use Case Diagram",
    "code"
  ],
  [
    "Fraud Rule Testing",
    "qa"
  ],
  [
    "Release Readiness",
    "qa"
  ],
  [
    "Xray",
    "qa"
  ],
  [
    "Draw.io",
    "code"
  ],
  [
    "JavaScript",
    "code"
  ],
  [
    "Regression Testing",
    "qa"
  ],
  [
    "Test Case Design",
    "qa"
  ],
  [
    "Test Data",
    "qa"
  ],
  [
    "Selenium",
    "qa"
  ],
  [
    "JWT Auth",
    "code"
  ],
  [
    "TailwindCSS",
    "code"
  ],
  [
    "Defect Investigation",
    "qa"
  ],
  [
    "Confluence",
    "qa"
  ],
  [
    "Mobile Testing Android",
    "qa"
  ],
  [
    "System Architecture",
    "ulik",
    "arsitektur"
  ],
  [
    "Integrasi API",
    "ulik",
    "arsitektur"
  ],
  [
    "Data Flow",
    "ulik",
    "arsitektur"
  ],
  [
    "AI Agent",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Hermes Agent",
    "ulik",
    "sendal_hermes"
  ],
  [
    "MCP",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Sub-agents",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Claude Code",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Codex CLI",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Ollama",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Local LLM",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Prompting",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Tool Use",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Agent Memory",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Cron Jobs",
    "ulik",
    "sendal_hermes"
  ],
  [
    "WhatsApp Bot",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Telegram Bot",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Atlassian MCP",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Postman MCP",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Automation",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Google Sheets API",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Notion API",
    "ulik",
    "sendal_hermes"
  ],
  [
    "Obsidian",
    "ulik"
  ]
];
