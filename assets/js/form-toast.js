/**
 * Themed form validation toasts (replaces window.alert for book-expert flows).
 * Usage: showFormToast('Message here');  or  showFormToast('Done!', { type: 'success' });
 */
(function (window) {
    'use strict';

    var DEFAULT_DURATION = 5500;
    var stack = null;

    function ensureStack() {
        if (!stack) {
            stack = document.createElement('div');
            stack.className = 'ym-form-toast-stack';
            stack.id = 'ym-form-toast-stack';
            stack.setAttribute('aria-live', 'polite');
            stack.setAttribute('aria-relevant', 'additions');
            document.body.appendChild(stack);
        }
        return stack;
    }

    function dismissToast(toast) {
        if (!toast || toast.classList.contains('ym-form-toast--hiding')) {
            return;
        }
        if (toast._hideTimer) {
            clearTimeout(toast._hideTimer);
            toast._hideTimer = null;
        }
        toast.classList.add('ym-form-toast--hiding');
        toast.addEventListener('animationend', function onEnd() {
            toast.removeEventListener('animationend', onEnd);
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }

    var icons = {
        error: 'fa-circle-exclamation',
        success: 'fa-circle-check',
        info: 'fa-circle-info'
    };

    var titles = {
        error: 'Please check your form',
        success: 'Success',
        info: 'Notice'
    };

    window.showFormToast = function (message, options) {
        options = options || {};
        var type = options.type || 'error';
        if (!icons[type]) {
            type = 'error';
        }

        var duration = options.duration !== undefined ? options.duration : DEFAULT_DURATION;
        var title = options.title !== undefined ? options.title : titles[type];

        var container = ensureStack();

        container.querySelectorAll('.ym-form-toast').forEach(function (existing) {
            dismissToast(existing);
        });

        var toast = document.createElement('div');
        toast.className = 'ym-form-toast ym-form-toast--' + type;
        toast.setAttribute('role', 'alert');

        toast.innerHTML =
            '<div class="ym-form-toast__icon" aria-hidden="true">' +
                '<i class="fas ' + icons[type] + '"></i>' +
            '</div>' +
            '<div class="ym-form-toast__body">' +
                '<p class="ym-form-toast__title">' + escapeHtml(title) + '</p>' +
                '<p class="ym-form-toast__message">' + escapeHtml(String(message || '')) + '</p>' +
            '</div>' +
            '<button type="button" class="ym-form-toast__close" aria-label="Dismiss">' +
                '<i class="fas fa-xmark" aria-hidden="true"></i>' +
            '</button>';

        toast.querySelector('.ym-form-toast__close').addEventListener('click', function () {
            dismissToast(toast);
        });

        container.appendChild(toast);

        if (duration > 0) {
            toast._hideTimer = setTimeout(function () {
                dismissToast(toast);
            }, duration);
        }

        return toast;
    };

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
})(window);
