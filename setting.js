document.addEventListener("DOMContentLoaded", function () {
  const darkThemeToggle = document.querySelector(".toggle");


    if (localStorage.getItem("dark-mode") === "enabled") {
      enableDarkMode();
    }

    darkThemeToggle.addEventListener("click", function () {
      if (localStorage.getItem("dark-mode") !== "enabled") {
        enableDarkMode();
      } else {
        disableDarkMode();
      }
    });

    function enableDarkMode() {
      document.body.classList.add("dark-mode");
      darkThemeToggle.textContent = "On";
      localStorage.setItem("dark-mode", "enabled");
    }

    function disableDarkMode() {
      document.body.classList.remove("dark-mode");
      darkThemeToggle.textContent = "Off";
      localStorage.setItem("dark-mode", "disabled");
    }
});

$(document).ready(function () {
  // Load data from get_data.php and replace content dynamically
  $.ajax({
    url: 'get_data.php',
    method: 'GET',
    success: function (data) {
           $('#user-image').attr('src', data);
          },
          error: function() {
              console.error('Error loading image.');
    
    },
    error: function (xhr, status, error) {
      console.error('Error loading data:', error);
    }
  });

  // Existing click event handlers
  $(document).on("click", ".picture-item", function () {
    if ($(this).hasClass("add")) {
      openModal();
    } else {
      if ($(this).hasClass("ball")) {
        $(".picture-item.ball").remove();
        $(".picture-item").show();
      }
      $(".list-page .list").hide();
      $(".list-page .page").hide();
      $(".list-page .info").fadeIn();

      // Display the selected item in detail (example for further implementation)
      const entry = $(this);
      const selectedHtml = `
        <div>
          <p><strong>Location:</strong> ${entry.find('p:contains("Location")').text().replace('Location: ', '')}</p>
          <p><strong>Species:</strong> ${entry.find('p:contains("Species")').text().replace('Species: ', '')}</p>
          <p><strong>Time:</strong> ${entry.find('p:contains("Time")').text().replace('Time: ', '')}</p>
        </div>
      `;
      $('.list-page .desc .text').html(selectedHtml);
      $('.list-page .desc .picture-item img').attr('src', entry.find('img').attr('src'));
    }
  });

  $(".list-page .desc .head .back").click(function () {
    $(".list-page .info").hide();
    $(".list-page .list").fadeIn();
    $(".list-page .page").fadeIn();
  });
});

