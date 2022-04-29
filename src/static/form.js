window.onload = () => {
  const form = document.getElementById("form");
  const getAllButton = document.getElementById("getall");
  const getButton = document.getElementById("get");
  const addButton = document.getElementById("add");
  const updateButton = document.getElementById("update");
  const deleteButton = document.getElementById("delete");

  /**
   * Get all data
   */
  getAllButton.addEventListener("click", () => {
    sendRequest("/api/getall", "GET", null);
  });

  /**
   * Get data
   */
  getButton.addEventListener("click", () => {
    const formData = readForm(form);
    sendRequest(`/api/${formData.id}`, "GET", null);
  });

  /**
   * Add new data
   */
  addButton.addEventListener("click", () => {
    const formData = readForm(form);
    sendRequest("/api/add", "POST", JSON.stringify(formData));
  });

  /**
   * Update existing data
   */
  updateButton.addEventListener("click", () => {
    const formData = readForm(form);
    sendRequest(
      `/api/update/${formData.id}`,
      "PATCH",
      JSON.stringify(formData)
    );
  });

  /**
   * Delete data
   */
  deleteButton.addEventListener("click", () => {
    const formData = readForm(form);
    sendRequest(`/api/delete/${formData.id}`, "DELETE", null);
  });

  /* Helper functions */
  const sendRequest = (endpoint, method, payload) => {
    fetch(endpoint, {
      method: method,
      body: payload,
      headers: { "Content-Type": "application/json;charset=utf-8" },
    })
      .catch(console.error)
      .then((res) => res.text())
      .then((data) => {
        console.log(data);
        try {
          const response = JSON.parse(data);
          displayResults(response);
        } catch (err) {
          if (err instanceof SyntaxError && err.message.includes("JSON")) {
            console.log(err);
            console.log(data);
          }
        }
      });
  };

  const readForm = (form) => {
    return { name: form.name.value, id: parseInt(form.id.value) };
  };

  const displayResults = (data) => {
    console.log(data);
    document.getElementById("response").innerText = JSON.stringify(
      data,
      null,
      2
    );
  };
};
