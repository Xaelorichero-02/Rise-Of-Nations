         <dm_lm_button>
            <button onclick="dm_lm()">Toggle Dark Mode</button>
            <script>
               function dm_lm() {
                  var element = document.body;
                  element.classList.toggle("dark-mode");
               }
            </script>
         </dm_lm_button>