(() => {
  const copy = document.querySelector("[data-copy-account]");
  if (copy && navigator.clipboard?.writeText) {
    copy.hidden = false;
    copy.addEventListener("click", async () => {
      const account = copy
        .closest(".temptation__account-row")
        ?.querySelector("[data-account-number]")
        ?.textContent.trim();
      const status = copy
        .closest(".ticket-checkout")
        ?.querySelector(".temptation__copy-status");
      if (!account || !status) return;
      try {
        await navigator.clipboard.writeText(account);
        status.textContent = "Account number copied.";
      } catch {
        status.textContent = "Select the account number to copy it manually.";
      }
    });
  }

  const checkout = document.querySelector("[data-ticket-checkout]");
  if (checkout) {
    const quantityInput = checkout.querySelector("[data-checkout-quantity]");
    const formatter = new Intl.NumberFormat("en-NG");
    let selectedTicket = null;
    let selectedSummary = null;
    let unitPrice = 0;

    const updateOrder = () => {
      if (!selectedTicket) return;
      const quantity = Math.max(
        1,
        Number.parseInt(quantityInput.value, 10) || 1,
      );
      const total = unitPrice * quantity;
      const order = `${quantity} × ${selectedTicket.name}`;
      checkout.querySelectorAll("[data-checkout-order]").forEach((element) => {
        element.textContent = order;
      });
      checkout.querySelectorAll("[data-checkout-total]").forEach((element) => {
        element.textContent = `₦${formatter.format(total)}`;
      });

      const message = [
        "Hi BLCKGROOVE, I would like to confirm my TEMPTATION ticket.",
        `Ticket: ${selectedTicket.name}`,
        `Quantity: ${quantity}`,
        `Total paid: ₦${formatter.format(total)}`,
        "I will attach my payment receipt.",
      ].join("\n");
      const encodedMessage = encodeURIComponent(message);
      checkout.querySelector("[data-checkout-primary]").href =
        `https://wa.me/2348121234627?text=${encodedMessage}`;
      checkout.querySelector("[data-checkout-backup]").href =
        `https://wa.me/2347084063705?text=${encodedMessage}`;
    };

    const showStep = (stepNumber) => {
      checkout.querySelectorAll("[data-checkout-step]").forEach((step) => {
        step.hidden = step.dataset.checkoutStep !== String(stepNumber);
      });
      checkout
        .querySelectorAll("[data-checkout-progress]")
        .forEach((progress) => {
          if (progress.dataset.checkoutProgress === String(stepNumber)) {
            progress.setAttribute("aria-current", "step");
          } else {
            progress.removeAttribute("aria-current");
          }
        });
      checkout
        .querySelector(
          `[data-checkout-step="${stepNumber}"] button, [data-checkout-step="${stepNumber}"] a`,
        )
        ?.focus();
    };

    document.querySelectorAll(".temptation__ticket").forEach((ticket) => {
      const summary = ticket.querySelector("summary");
      summary.addEventListener("click", (event) => {
        event.preventDefault();
        selectedSummary = summary;
        unitPrice = Number(ticket.dataset.ticketPrice);
        selectedTicket = {
          name: ticket
            .querySelector(".temptation__ticket-title")
            .textContent.trim(),
          description:
            ticket
              .querySelector(
                ".temptation__ticket-description, .temptation__access-note",
              )
              ?.textContent.trim() || "",
        };
        checkout.querySelector("[data-checkout-name]").textContent =
          selectedTicket.name;
        checkout.querySelector("[data-checkout-description]").textContent =
          selectedTicket.description;
        quantityInput.value = "1";
        updateOrder();
        showStep(1);
        if (!checkout.open) checkout.showModal();
      });
    });

    quantityInput.addEventListener("input", updateOrder);
    quantityInput.addEventListener("change", () => {
      quantityInput.value = String(
        Math.max(1, Number.parseInt(quantityInput.value, 10) || 1),
      );
      updateOrder();
    });

    checkout.querySelectorAll("[data-checkout-next]").forEach((button) => {
      button.addEventListener("click", () =>
        showStep(button.dataset.checkoutNext),
      );
    });
    checkout
      .querySelector("[data-checkout-close]")
      .addEventListener("click", () => checkout.close());
    checkout.addEventListener("click", (event) => {
      if (event.target === checkout) checkout.close();
    });
    checkout.addEventListener("close", () => {
      showStep(1);
      selectedSummary?.focus();
    });
  }

  const elements = document.querySelectorAll("[data-temptation-reveal]");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  if (reduced.matches || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("is-unseen");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08 },
  );
  elements.forEach((element) => {
    element.classList.add("is-unseen");
    observer.observe(element);
  });
  reduced.addEventListener("change", () => {
    if (!reduced.matches) return;
    observer.disconnect();
    elements.forEach((element) => element.classList.remove("is-unseen"));
  });
})();
