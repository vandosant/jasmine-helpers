beforeEach(function () {
  jasmine.addMatchers({
    toHaveClass: function () {
      return {
        compare: function (actual, className) {
          return { pass: $(actual).hasClass(className) }
        }
      }
    },

    toHaveCss: function () {
      return {
        compare: function (actual, css) {
          for (var prop in css){
            var value = css[prop]
            // see issue #147 on gh
              ;if (value === 'auto' && $(actual).get(0).style[prop] === 'auto') continue
            if ($(actual).css(prop) !== value) return { pass: false }
          }
          return { pass: true }
        }
      }
    },

    toBeVisible: function () {
      return {
        compare: function (actual) {
          return { pass: $(actual).is(':visible') }
        }
      }
    },

    toBeHidden: function () {
      return {
        compare: function (actual) {
          return { pass: $(actual).is(':hidden') }
        }
      }
    },

    toBeSelected: function () {
      return {
        compare: function (actual) {
          return { pass: $(actual).is(':selected') }
        }
      }
    },

    toBeChecked: function () {
      return {
        compare: function (actual) {
          return { pass: $(actual).is(':checked') }
        }
      }
    },

    toBeEmpty: function () {
      return {
        compare: function (actual) {
          return { pass: $(actual).is(':empty') }
        }
      }
    },

    toBeInDOM: function () {
      return {
        compare: function (actual) {
          return { pass: $.contains(document.documentElement, $(actual)[0]) }
        }
      }
    },

    toExist: function () {
      return {
        compare: function (actual) {
          return { pass: $(actual).length }
        }
      }
    },

    toHaveLength: function () {
      return {
        compare: function (actual, length) {
          return { pass: $(actual).length === length }
        }
      }
    },

    toHaveAttr: function () {
      return {
        compare: function (actual, attributeName, expectedAttributeValue) {
          return { pass: hasProperty($(actual).attr(attributeName), expectedAttributeValue) }
        }
      }
    },

    toHaveProp: function () {
      return {
        compare: function (actual, propertyName, expectedPropertyValue) {
          return { pass: hasProperty($(actual).prop(propertyName), expectedPropertyValue) }
        }
      }
    },

    toHaveId: function () {
      return {
        compare: function (actual, id) {
          return { pass: $(actual).attr('id') == id }
        }
      }
    },

    toHaveHtml: function () {
      return {
        compare: function (actual, html) {
          return { pass: $(actual).html() == jasmine.jQuery.browserTagCaseIndependentHtml(html) }
        }
      }
    },

    toContainHtml: function () {
      return {
        compare: function (actual, html) {
          var actualHtml = $(actual).html()
            , expectedHtml = jasmine.jQuery.browserTagCaseIndependentHtml(html)

          return { pass: (actualHtml.indexOf(expectedHtml) >= 0) }
        }
      }
    },

    toHaveText: function () {
      return {
        compare: function (actual, text) {
          var actualText = $(actual).text()
          var trimmedText = $.trim(actualText)

          if (text && $.isFunction(text.test)) {
            return { pass: text.test(actualText) || text.test(trimmedText) }
          } else {
            return { pass: (actualText == text || trimmedText == text) }
          }
        }
      }
    },

    toContainText: function () {
      return {
        compare: function (actual, text) {
          var trimmedText = $.trim($(actual).text())

          if (text && $.isFunction(text.test)) {
            return { pass: text.test(trimmedText) }
          } else {
            return { pass: trimmedText.indexOf(text) != -1 }
          }
        }
      }
    },

    toHaveValue: function () {
      return {
        compare: function (actual, value) {
          return { pass: $(actual).val() === value }
        }
      }
    },

    toHaveData: function () {
      return {
        compare: function (actual, key, expectedValue) {
          return { pass: hasProperty($(actual).data(key), expectedValue) }
        }
      }
    },

    toContainElement: function () {
      return {
        compare: function (actual, selector) {
          if (window.debug) debugger
          return { pass: $(actual).find(selector).length }
        }
      }
    },

    toBeMatchedBy: function () {
      return {
        compare: function (actual, selector) {
          return { pass: $(actual).filter(selector).length }
        }
      }
    },

    toBeDisabled: function () {
      return {
        compare: function (actual, selector) {
          return { pass: $(actual).is(':disabled') }
        }
      }
    },

    toBeFocused: function (selector) {
      return {
        compare: function (actual, selector) {
          return { pass: $(actual)[0] === $(actual)[0].ownerDocument.activeElement }
        }
      }
    },

    toHandle: function () {
      return {
        compare: function (actual, event) {
          var events = $._data($(actual).get(0), "events")

          if (!events || !event || typeof event !== "string") {
            return { pass: false }
          }

          var namespaces = event.split(".")
            , eventType = namespaces.shift()
            , sortedNamespaces = namespaces.slice(0).sort()
            , namespaceRegExp = new RegExp("(^|\\.)" + sortedNamespaces.join("\\.(?:.*\\.)?") + "(\\.|$)")

          if (events[eventType] && namespaces.length) {
            for (var i = 0; i < events[eventType].length; i++) {
              var namespace = events[eventType][i].namespace

              if (namespaceRegExp.test(namespace))
                return { pass: true }
            }
          } else {
            return { pass: (events[eventType] && events[eventType].length > 0) }
          }

          return { pass: false }
        }
      }
    },

    toHandleWith: function () {
      return {
        compare: function (actual, eventName, eventHandler) {
          var normalizedEventName = eventName.split('.')[0]
            , stack = $._data($(actual).get(0), "events")[normalizedEventName]

          for (var i = 0; i < stack.length; i++) {
            if (stack[i].handler == eventHandler) return { pass: true }
          }

          return { pass: false }
        }
      }
    },

    toHaveBeenTriggeredOn: function () {
      return {
        compare: function (actual, selector) {
          var result = { pass: jasmine.jQuery.events.wasTriggered(selector, actual) }

          result.message = result.pass ?
            "Expected event " + $(actual) + " not to have been triggered on " + selector :
            "Expected event " + $(actual) + " to have been triggered on " + selector

          return result;
        }
      }
    },

    toHaveBeenTriggered: function (){
      return {
        compare: function (actual) {
          var eventName = actual.eventName
            , selector = actual.selector
            , result = { pass: jasmine.jQuery.events.wasTriggered(selector, eventName) }

          result.message = result.pass ?
            "Expected event " + eventName + " not to have been triggered on " + selector :
            "Expected event " + eventName + " to have been triggered on " + selector

          return result
        }
      }
    },

    toHaveBeenTriggeredOnAndWith: function (j$, customEqualityTesters) {
      return {
        compare: function (actual, selector, expectedArgs) {
          var wasTriggered = jasmine.jQuery.events.wasTriggered(selector, actual)
            , result = { pass: wasTriggered && jasmine.jQuery.events.wasTriggeredWith(selector, actual, expectedArgs, j$, customEqualityTesters) }

          if (wasTriggered) {
            var actualArgs = jasmine.jQuery.events.args(selector, actual, expectedArgs)[1]
            result.message = result.pass ?
              "Expected event " + actual + " not to have been triggered with " + jasmine.pp(expectedArgs) + " but it was triggered with " + jasmine.pp(actualArgs) :
              "Expected event " + actual + " to have been triggered with " + jasmine.pp(expectedArgs) + "  but it was triggered with " + jasmine.pp(actualArgs)

          } else {
            // todo check on this
            result.message = result.pass ?
              "Expected event " + actual + " not to have been triggered on " + selector :
              "Expected event " + actual + " to have been triggered on " + selector
          }

          return result
        }
      }
    },

    toHaveBeenPreventedOn: function () {
      return {
        compare: function (actual, selector) {
          var result = { pass: jasmine.jQuery.events.wasPrevented(selector, actual) }

          result.message = result.pass ?
            "Expected event " + actual + " not to have been prevented on " + selector :
            "Expected event " + actual + " to have been prevented on " + selector

          return result
        }
      }
    },

    toHaveBeenPrevented: function () {
      return {
        compare: function (actual) {
          var eventName = actual.eventName
            , selector = actual.selector
            , result = { pass: jasmine.jQuery.events.wasPrevented(selector, eventName) }

          result.message = result.pass ?
            "Expected event " + eventName + " not to have been prevented on " + selector :
            "Expected event " + eventName + " to have been prevented on " + selector

          return result
        }
      }
    },

    toHaveBeenStoppedOn: function () {
      return {
        compare: function (actual, selector) {
          var result = { pass: jasmine.jQuery.events.wasStopped(selector, actual) }

          result.message = result.pass ?
            "Expected event " + actual + " not to have been stopped on " + selector :
            "Expected event " + actual + " to have been stopped on " + selector

          return result;
        }
      }
    },

    toHaveBeenStopped: function () {
      return {
        compare: function (actual) {
          var eventName = actual.eventName
            , selector = actual.selector
            , result = { pass: jasmine.jQuery.events.wasStopped(selector, eventName) }

          result.message = result.pass ?
            "Expected event " + eventName + " not to have been stopped on " + selector :
            "Expected event " + eventName + " to have been stopped on " + selector

          return result
        }
      }
    }
  })
