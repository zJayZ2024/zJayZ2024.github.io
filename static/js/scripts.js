const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'awards'];

window.addEventListener('DOMContentLoaded', event => {

    // Keep only the sections that currently contain real content.
    ['experience', 'publications'].forEach(name => {
        const section = document.getElementById(name);
        if (section) section.remove();

        const navLink = document.querySelector(`#navbarResponsive a[href="#${name}"]`);
        if (navLink && navLink.parentElement) navLink.parentElement.remove();
    });

    // Use the current GitHub profile avatar.
    const avatar = document.querySelector('#avatar img');
    if (avatar) {
        avatar.src = 'https://avatars.githubusercontent.com/u/181553458?v=4';
        avatar.alt = 'Junzhe Zhang';
    }

    // Point footer links to the current GitHub profile and homepage repository.
    const githubLink = document.getElementById('github-link');
    if (githubLink) githubLink.href = 'https://github.com/zJayZ2024';

    const licenseLink = document.getElementById('license-link');
    if (licenseLink) licenseLink.href = 'https://github.com/zJayZ2024/zJayZ2024.github.io/blob/main/LICENSE';

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }
            })
        })
        .catch(error => console.log(error));

    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    })

});
