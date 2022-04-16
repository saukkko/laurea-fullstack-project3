window.onload = () => {
  const form = document.getElementById("form");
  const button = document.getElementById("button");

  button.addEventListener("click", () => {
    const payload = {
      name: form.name.value,
      user_id: form.user_id.value,
      dob: Date.parse(form.dob.value),
    };

    fetch("/api/add", {
      method: "post",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json;charset=utf-8" },
    })
      .catch(console.error)
      .then((res) => res.json())
      .then(console.log);
  });
};
