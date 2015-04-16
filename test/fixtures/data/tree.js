"use strict";

module.exports = {
    label: 'Tree root',
    children: [
        {
            label: 'file.txt'
        },
        {
            label: 'pictures',
            children: [
                {
                    label: 'profile.jpg'
                },
                {
                    label: 'holiday',
                    children: [
                        { label: 'picture-1.jpg'},
                        { label: 'picture-2.jpg'},
                        { label: 'picture-3.jpg'}
                    ]
                }
            ]
        }
    ]
};
