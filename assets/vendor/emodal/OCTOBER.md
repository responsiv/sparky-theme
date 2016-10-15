# Important

This script has been modified to work with October CMS' framework

Handler example:

    function onDisplayModal()
    {
        return 'Hello world!';
    }

Example:

    // Display a October CMS request modal, with a title
    eModal.request('onDisplayModal', 'Jobs - Form apply')
          .then(ajaxOnLoadCallback);

Request partial example:

    eModal.request({
        handler: 'onDisplayModal',
        partial: 'mypartial',
        title: 'Jobs - Form apply'
    })

#### Further documentation

- See vendor docs for usage: http://saribe.github.io/eModal/
