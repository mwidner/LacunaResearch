// Generated by CoffeeScript 1.9.3
(function() {
  var $,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  $ = jQuery;

  Annotator.Plugin.Privacy = (function(superClass) {
    extend(Privacy, superClass);

    function Privacy() {
      this.addPrivacy = bind(this.addPrivacy, this);
      return Privacy.__super__.constructor.apply(this, arguments);
    }

    Privacy.prototype.events = {
      'annotationEditorShown': "addPrivacy",
      'annotationEditorSubmit': "savePrivacy"
    };

    Privacy.prototype.field = null;

    Privacy.prototype.input = null;

    Privacy.prototype.pluginInit = function() {
      if (!Annotator.supported()) {
        return;
      }
      this.field = this.annotator.editor.addField({
        label: Annotator._t('Privacy')
      });
      return this.annotator.viewer.addField({
        load: this.updateViewer
      });
    };

    Privacy.prototype.addPrivacy = function(event, annotation) {
      var checked, gid, group, group_object, group_type, groups, groups_html, j, len, privacy_html, privacy_type, ref, settings, show_groups;
      settings = annotation.privacy_options ? annotation.privacy_options : Drupal.settings.privacy_options;
      groups_html = privacy_html = show_groups = '';
      privacy_html += '<span class="privacy types">';
      ref = ["Private", "Instructor", "Co-Learners", "Everyone"];
      for (j = 0, len = ref.length; j < len; j++) {
        privacy_type = ref[j];
        checked = settings.audience[privacy_type.toLowerCase()] ? 'checked' : '';
        if ("Co-Learners" === privacy_type && "checked" === checked) {
          show_groups = 'show-groups';
        }
        privacy_html += '<span class="privacy-type ' + checked + '" id="' + privacy_type + '">' + privacy_type + '</span>';
      }
      privacy_html += '</span>';
      groups = settings.groups;
      for (group_type in groups) {
        group_object = groups[group_type];
        for (gid in group_object) {
          group = group_object[gid];
          groups_html += '<label class="privacy group">';
          checked = group.selected ? 'checked="checked"' : '';
          groups_html += '<input type="checkbox" class="privacy-group ' + group_type + '" value="' + gid + '" ' + checked + ' />';
          groups_html += group[0];
          groups_html += '</label>';
        }
      }
      groups_html = '<span class="privacy-groups ' + show_groups + '">' + groups_html + '</span>';
      return $(this.field).html(privacy_html + groups_html);
    };

    Privacy.prototype.savePrivacy = function(event, annotation) {
      var audience, course_groups, peer_groups;
      annotation.privacy_options = {};
      course_groups = {};
      peer_groups = {};
      audience = {};
      $('.annotator-editor span.privacy-type').each(function() {
        var type;
        type = $(this).attr("id").toLowerCase();
        if ($(this).hasClass("checked")) {
          audience[type] = 1;
        } else {
          audience[type] = 0;
        }
        return $('.annotator-editor input.privacy-group[type=checkbox]').each(function() {
          var checked, gid, group_name, parent;
          checked = $(this).is(":checked") ? 1 : 0;
          gid = $(this).val();
          parent = $(this).parent();
          group_name = parent[0].textContent;
          if ($(this).hasClass("course_groups")) {
            return course_groups[gid] = {
              0: group_name,
              selected: checked
            };
          } else {
            return peer_groups[gid] = {
              0: group_name,
              selected: checked
            };
          }
        });
      });
      annotation.privacy_options.audience = audience;
      return annotation.privacy_options.groups = {
        peer_groups: peer_groups,
        course_groups: course_groups
      };
    };

    Privacy.prototype.updateViewer = function(field, annotation) {
      var audience, audience_type, checked, gid, gids, group, group_type, groups, has_groups, i, ref, ref1;
      if (annotation.privacy_options) {
        audience = '<div class="privacy-types">';
        ref = annotation.privacy_options.audience;
        for (audience_type in ref) {
          checked = ref[audience_type];
          if (checked) {
            audience += '<span class="privacy-type">' + audience_type + '</span>';
            if ('co-learners' === audience_type) {
              has_groups = true;
            }
          }
        }
        audience += '</div>';
        groups = '';
        if (has_groups) {
          groups = '<div class="privacy-groups">';
          i = 0;
          ref1 = annotation.privacy_options.groups;
          for (group_type in ref1) {
            gids = ref1[group_type];
            for (gid in gids) {
              group = gids[gid];
              if (group && group.selected) {
                groups += '<span class="privacy-group checked ' + group_type + '">' + group[0] + '</span>';
              }
            }
          }
          groups += '</div>';
        }
        return $(field).addClass("privacy").html(audience + groups);
      }
    };

    return Privacy;

  })(Annotator.Plugin);

}).call(this);
