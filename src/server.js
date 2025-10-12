/**CREATE TABLE TimeSheet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    NTradsul VARCHAR(50) NOT NULL,
    DtInicial DATETIME NOT NULL,
    DtFinal DATETIME NOT NULL, -- Adicionei DtFinal aqui
    Descricao TEXT,
    TpIncidencia VARCHAR(50) NOT NULL,
    Executante VARCHAR(50) NOT NULL
); */