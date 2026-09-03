document.addEventListener("DOMContentLoaded", () => {
  // Elements for Sign-In
  const loginForm = document.getElementById("loginForm");
  const identifierInput = document.getElementById("identifier");
  const passwordInput = document.getElementById("password");
  const loginErrorDiv = document.getElementById("errorMessage");

  // Elements for Sign-Up
  const signupForm = document.getElementById("signupFormElement");
  const signupFirstName = document.getElementById("signup-firstname");
  const signupLastName = document.getElementById("signup-lastname");
  const signupEmail = document.getElementById("signup-email");
  const signupRole = document.getElementById("signup-role");
  const signupClass = document.getElementById("signup-class");
  const signupPassword = document.getElementById("signup-password");
  const signupConfirm = document.getElementById("signup-confirm");

  // Default initial users if none are saved in localStorage
  const getRegisteredUsers = () => {
    const storedUsers = localStorage.getItem("registeredUsers");
    if (storedUsers) {
      return JSON.parse(storedUsers);
    } else {
      const defaultUsers = [
        {
          email: "emeka12@gmail.com",
          regNumber: "STP/2024/001",
          password: "password123",
          name: "Emeka",
        },
        {
          email: "admin@starplus.com",
          regNumber: "STP/2024/000",
          password: "admin123",
          name: "Administrator",
        },
      ];
      localStorage.setItem("registeredUsers", JSON.stringify(defaultUsers));
      return defaultUsers;
    }
  };

  // Helper: Regex to validate strict email structure (e.g. name@domain.com)
  function isValidEmailFormat(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // UI Error Display Helpers
  function showLoginError(message) {
    if (loginErrorDiv) {
      loginErrorDiv.textContent = message;
      loginErrorDiv.style.display = "block";
    } else {
      alert(message);
    }
  }

  function clearLoginError() {
    if (loginErrorDiv) {
      loginErrorDiv.textContent = "";
      loginErrorDiv.style.display = "none";
    }
  }

  // ==========================================
  // 1. SIGN IN FORM LOGIC
  // ==========================================
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearLoginError();

      const enteredIdentifier = identifierInput.value.trim().toLowerCase();
      const enteredPassword = passwordInput.value.trim();
      const users = getRegisteredUsers();

      // Is the input formatted like an email address?
      const isEmailInput = enteredIdentifier.includes("@");

      // FORMAT CHECK: If they entered an email address, verify its structure
      if (isEmailInput && !isValidEmailFormat(enteredIdentifier)) {
        showLoginError(
          "Invalid email address format. Please enter a valid email (e.g., name@gmail.com).",
        );
        identifierInput.focus();
        return;
      }

      // CHECK 1: Does the account exist in our database?
      const accountExists = users.some(
        (user) =>
          user.email.toLowerCase() === enteredIdentifier ||
          (user.regNumber &&
            user.regNumber.toLowerCase() === enteredIdentifier),
      );

      if (!accountExists) {
        showLoginError(
          "This email or registration number is not registered on this system. Please check or sign up.",
        );
        identifierInput.focus();
        return;
      }

      // CHECK 2: Find exact user profile
      const userAccount = users.find(
        (user) =>
          user.email.toLowerCase() === enteredIdentifier ||
          (user.regNumber &&
            user.regNumber.toLowerCase() === enteredIdentifier),
      );

      // CHECK 3: Verify password
      if (userAccount.password !== enteredPassword) {
        showLoginError(
          "Incorrect password. Please try again or click 'Forgot Password?'.",
        );
        passwordInput.focus();
        return;
      }

      // Admin Redirect Check
      if (userAccount.email === "admin@starplus.com") {
        localStorage.setItem("starplus_admin_logged_in", "true");
        window.location.href = "admin.html";
        return;
      }

      // Success
      localStorage.setItem("currentUser", JSON.stringify(userAccount));
      window.location.href = "Home.html";
    });
  }

  // ==========================================
  // 2. SIGN UP FORM LOGIC
  // ==========================================
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailVal = signupEmail.value.trim().toLowerCase();
      const passVal = signupPassword.value.trim();
      const confirmVal = signupConfirm.value.trim();

      // Validate email format during signup
      if (!isValidEmailFormat(emailVal)) {
        alert("Please provide a valid, properly formatted email address.");
        signupEmail.focus();
        return;
      }

      if (passVal !== confirmVal) {
        alert("Passwords do not match!");
        return;
      }

      const users = getRegisteredUsers();

      // Check if email already exists
      const emailTaken = users.some(
        (user) => user.email.toLowerCase() === emailVal,
      );

      if (emailTaken) {
        alert("An account with this email already exists! Please sign in.");
        return;
      }

      // Generate Registration Number
      const randomId = Math.floor(100 + Math.random() * 900);
      const generatedRegNum = `STP/2026/${randomId}`;

      const newUser = {
        name: `${signupFirstName.value.trim()} ${signupLastName.value.trim()}`,
        email: emailVal,
        regNumber: generatedRegNum,
        role: signupRole.value,
        className: signupClass.value.trim(),
        password: passVal,
      };

      users.push(newUser);
      localStorage.setItem("registeredUsers", JSON.stringify(users));

      alert(
        `Account created successfully! Your Registration Number is ${generatedRegNum}`,
      );

      identifierInput.value = emailVal;
      if (typeof switchToLogin === "function") {
        switchToLogin();
      }
    });
  }
});
